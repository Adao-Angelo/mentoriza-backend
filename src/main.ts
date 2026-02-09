import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API - Gerenciamento de Grupos e Relatórios')
    .setDescription(
      'API para coordenadores gerenciarem estudantes, grupos, submissões e indicadores ABNT/IA',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  if (process.env.ENABLE_RMQ === 'true') {
    const rmqUrl = process.env.RMQ_URL;
    if (!rmqUrl) {
      console.error(
        'RMQ_URL não definido no ambiente. Microservice não será iniciado.',
      );
    } else {
      console.log(
        `Conectando ao RabbitMQ: ${rmqUrl.replace(/:\/\/.*@/, '://***@')}`,
      );
      app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
          urls: [rmqUrl],
          queue: 'report_results',
          queueOptions: { durable: true },
        },
      });

      await app.startAllMicroservices();
    }
  } else {
    console.log('Microservice RMQ desabilitado (ENABLE_RMQ !== true)');
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  console.log(
    `Aplicação rodando na porta ${port} | Swagger: http://localhost:${port}/api`,
  );
}

bootstrap().catch((err) => {
  console.error('Erro fatal no bootstrap:', err);
  process.exit(1);
});

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Iniciando seed dos indicadores...');

  const indicadores = [
    {
      title: 'Nível máximo aceite de IA',
      value: 20,
      type: 'max',
    },
    {
      title: 'Nível mínimo de aderência às normas ABNT',
      value: 70,
      type: 'min',
    },
    {
      title: 'Nível mínimo de fundamentação teórica',
      value: 50,
      type: 'min',
    },
  ];

  for (const ind of indicadores) {
    await prisma.indicator.upsert({
      where: { title: ind.title },
      update: ind,
      create: ind,
    });
    console.log(`Indicador processado: ${ind.title} (${ind.value}%)`);
  }

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

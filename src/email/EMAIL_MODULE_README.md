# Email Module - Documentação

## Visão Geral

O módulo de email do Mentoriza utiliza uma arquitetura baseada em **fila** com **Bull** e **Redis** para garantir entrega confiável de emails em cenários assíncronos. Todos os templates são responsivos e utilizam **Tailwind CSS** via CDN com a cor primária **#9810FA**.

## Arquitetura

```
📧 EmailQueueService (Enfileira emails)
    ↓
🚀 Redis Queue (Bull)
    ↓
⚙️ EmailProcessor (Processa)
    ↓
📤 EmailService (Envia via Nodemailer)
    ↓
✉️ Servidor SMTP
```

## Tipos de Email

### 1. **GROUP_PUBLISHED** 📮

Enviado quando um grupo é publicado pelo coordenador.

**Dados necessários:**

```typescript
{
  studentName: string;
  groupName: string;
  email: string;
  password: string;
  advisorName: string;
  advisorEmail?: string;
  coAdvisorName?: string;
  coAdvisorEmail?: string;
  courseCode: string;
  studentRA?: string;
}
```

**Exemplo de uso:**

```typescript
await this.emailQueueService.sendGroupPublishedEmail({
  studentName: 'João Silva',
  groupName: 'Grupo 1',
  email: 'joao@email.com',
  password: 'temp123456',
  advisorName: 'Dr. Pedro',
  advisorEmail: 'pedro@email.com',
  courseCode: 'INF001',
});
```

### 2. **REPORT_APPROVED** ✅

Enviado quando um relatório é aprovado.

**Exemplo de uso:**

```typescript
await this.emailQueueService.sendReportApprovedEmail(
  'group@email.com',
  'Grupo 1',
  8.5,
  'Submissão 1',
  'Excelente estrutura e conformidade com ABNT',
);
```

### 3. **REPORT_REJECTED** ❌

Enviado quando um relatório é rejeitado.

**Exemplo de uso:**

```typescript
await this.emailQueueService.sendReportRejectedEmail(
  'group@email.com',
  'Grupo 1',
  4.2,
  'Submissão 1',
  [
    'Conteúdo gerado por IA excede 25%',
    'Falta de conformidade com normas ABNT',
    'Citações incompletas',
  ],
  'Revise especialmente as seções de citações',
);
```

### 4. **REPORT_UNDER_REVIEW** 🔍

Enviado quando um relatório é recebido e está em avaliação.

**Exemplo de uso:**

```typescript
await this.emailQueueService.sendReportUnderReviewEmail(
  'group@email.com',
  'Grupo 1',
  'Submissão 1',
);
```

### 5. **SUBMISSION_ACTIVE** 📤

Enviado quando uma nova submissão é ativada.

**Exemplo de uso:**

```typescript
await this.emailQueueService.sendSubmissionActiveEmail(
  'group@email.com',
  'Submissão Final',
  new Date('2026-03-15'),
  'Envie seu relatório final com as correções solicitadas',
);
```

## Instalação e Configuração

### 1. Instalar Dependências

```bash
npm install @nestjs/bull bull nodemailer @nestjs/config redis
npm install -D @types/nodemailer
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha as variáveis:

```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email SMTP (exemplo com Gmail)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_FROM=noreply@mentoriza.com

DATABASE_URL=postgresql://user:password@localhost:5432/mentoriza
```

### 3. Configurar Gmail (se usando)

1. Ative "Aplicativos menos seguros" ou use "Senha de app"
2. Acesse: https://myaccount.google.com/apppasswords
3. Copie a senha e coloque em `EMAIL_PASSWORD`

### 4. Iniciar Redis

```bash
# Com Docker
docker run -d -p 6379:6379 redis:alpine

# Ou instalar localmente
redis-server
```

### 5. O módulo já está importado em `app.module.ts`

## Integrações com Outros Módulos

### Reports Service

Quando um relatório muda de status, envie email:

```typescript
// Em reports.service.ts
import { EmailQueueService } from '../email/email-queue.service';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private emailQueue: EmailQueueService,
  ) {}

  async updateStatus(id: number, status: ReportStatus) {
    const report = await this.prisma.report.update({
      where: { id },
      data: { status },
      include: { group: true, submission: true },
    });

    // Enviar email baseado no novo status
    if (status === 'approved') {
      await this.emailQueue.sendReportApprovedEmail(
        report.group.email,
        report.group.name,
        report.score,
        report.submission.name,
        report.observations,
      );
    } else if (status === 'rejected') {
      // Enviar email de rejeição
    }

    return report;
  }
}
```

### Groups Controller

Quando um grupo é publicado, enviar credenciais:

```typescript
// Em groups.controller.ts
async publishGroup(id: number) {
  const group = await this.groupsService.publish(id);

  // Enviar emails para todos os estudantes
  const studentsData = group.students.map(student => ({
    studentName: student.name,
    groupName: group.name,
    email: student.email,
    password: 'generated_password',
    advisorName: group.advisor.user.name,
    courseCode: group.course,
  }));

  await this.emailQueue.sendBulkGroupPublishedEmails(studentsData);
  return group;
}
```

### Submissions Service

Quando uma submissão é ativada:

```typescript
async activateSubmission(id: number) {
  const submission = await this.prisma.submission.update({
    where: { id },
    data: { status: 'active' },
  });

  // Notificar todos os grupos
  const groups = await this.prisma.group.findMany({
    include: { students: true },
  });

  for (const group of groups) {
    const emails = group.students.map(s => s.email);
    for (const email of emails) {
      await this.emailQueue.sendSubmissionActiveEmail(
        email,
        submission.name,
        submission.endDate,
      );
    }
  }

  return submission;
}
```

## Design dos Templates

Todos os templates incluem:

- ✅ **Responsivo** - Funciona em mobile e desktop
- 🎨 **Tailwind CSS** - Via CDN (sem build necessário)
- 🌈 **Cor primária** - #9810FA em todos os elementos
- 📱 **Mobile-first** - Otimizado para smartphones
- ♿ **Acessível** - Contraste adequado e semântica HTML

### Cores Utilizadas

- **Primária**: #9810FA (roxo escuro)
- **Sucesso**: #10b981 (verde)
- **Erro**: #ef4444 (vermelho)
- **Aviso**: #f59e0b (âmbar)
- **Fundo**: #f3f0ff (roxo muito claro)

## Monitoramento da Fila

Para visualizar a fila em tempo real, use ferramentas como:

- **Bull Board**: Dashboard visual
- **Redis CLI**: `redis-cli`
- **Logs**: Check console

```typescript
// Instalar Bull Board (opcional)
npm install @bull-board/express @bull-board/ui

// No main.ts
import { createBullBoard } from '@bull-board/express';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/bull';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());
```

## Tratamento de Erros

A fila está configurada com:

- **Tentativas**: 3
- **Backoff**: Exponencial (2s, 4s, 8s)
- **Remoção**: Automática após sucesso

Verifique logs para erros de envio:

```bash
# Filtrar erros de email
npm run start -- | grep "EmailProcessor"
```

## Troubleshooting

| Problema             | Solução                                     |
| -------------------- | ------------------------------------------- |
| Redis não conecta    | Verifique se está rodando: `redis-cli ping` |
| Emails não enviam    | Verifique credenciais SMTP no `.env`        |
| Fila cresce infinito | Aumente workers ou verifique logs           |
| Senha Gmail inválida | Use "Senha de app", não a senha normal      |

## Próximas Melhorias

- [ ] Adicionar suporte a attachment (PDF dos resultados)
- [ ] Implementar unsubscribe de emails
- [ ] Adicionar templates em português do Brasil
- [ ] Configurar SMTP autenticado para produção
- [ ] Adicionar analytics de entrega

---

**Criado em**: 02/02/2026
**Versão**: 1.0.0

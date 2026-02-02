import { SubmissionActiveEmailData } from '../email.types';

export function generateSubmissionActiveTemplate(
  data: SubmissionActiveEmailData,
): string {
  const deadlineFormatted = new Date(data.deadlineDate).toLocaleDateString(
    'pt-BR',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  );

  const daysUntilDeadline = Math.ceil(
    (new Date(data.deadlineDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <title>Nova Submissão Ativa - Mentoriza</title>
    </head>
    <body class="bg-gray-100 m-0 p-0">
      <div class="bg-white max-w-2xl mx-auto my-8 rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-[#9810FA] to-[#7a0f9f] text-white px-6 py-8">
          <h1 class="text-3xl font-bold">📤 Submissão Ativa!</h1>
          <p class="text-indigo-100 mt-2">Período de envio aberto</p>
        </div>

        <!-- Content -->
        <div class="px-6 py-8">
          <p class="text-gray-700 text-lg mb-6">
            Olá pessoal,
          </p>

          <p class="text-gray-600 mb-6">
            Uma nova rodada de submissão foi aberta! Agora vocês podem fazer upload de seus relatórios 
            na plataforma. <span class="font-semibold">Atenção ao prazo!</span>
          </p>

          <!-- Submission Info -->
          <div class="bg-gradient-to-br from-[#f3f0ff] to-[#faf5ff] border-2 border-[#9810FA] rounded-lg p-6 mb-6">
            <h3 class="text-[#9810FA] font-bold text-lg mb-4">📌 Informações da Submissão</h3>
            
            <div class="space-y-3">
              <div class="bg-white p-3 rounded border border-[#9810FA] border-opacity-30">
                <p class="text-sm text-gray-600 font-semibold">Submissão:</p>
                <p class="text-[#9810FA] font-semibold text-lg">${data.submissionName}</p>
              </div>

              <div class="bg-white p-3 rounded border border-[#9810FA] border-opacity-30">
                <p class="text-sm text-gray-600 font-semibold">Prazo Limite:</p>
                <p class="text-lg font-semibold text-gray-800">${deadlineFormatted}</p>
              </div>

              <div class="bg-white p-3 rounded border border-red-300 bg-red-50">
                <p class="text-sm text-red-700 font-semibold">⏰ Tempo Restante:</p>
                <p class="text-lg font-bold text-red-600">${daysUntilDeadline} dias</p>
              </div>
            </div>
          </div>

          ${
            data.description
              ? `
          <!-- Description -->
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 class="text-gray-800 font-bold text-lg mb-3">📝 Descrição</h3>
            <p class="text-gray-700">${data.description}</p>
          </div>
          `
              : ''
          }

          <!-- Important Points -->
          <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
            <h3 class="text-blue-800 font-bold mb-3">✨ Pontos Importantes</h3>
            <ul class="space-y-2">
              <li class="flex items-start text-gray-700">
                <span class="text-blue-600 font-bold mr-2">📋</span>
                Verifique todos os requisitos antes de enviar
              </li>
              <li class="flex items-start text-gray-700">
                <span class="text-blue-600 font-bold mr-2">📄</span>
                Arquivo deve estar em PDF
              </li>
              <li class="flex items-start text-gray-700">
                <span class="text-blue-600 font-bold mr-2">⚠️</span>
                Não haverá extensão de prazo - respeite o cronograma
              </li>
              <li class="flex items-start text-gray-700">
                <span class="text-blue-600 font-bold mr-2">🔍</span>
                Sua submissão será avaliada automaticamente por IA
              </li>
            </ul>
          </div>

          <!-- Timeline -->
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-[#9810FA] border-opacity-30 rounded-lg p-6 mb-6">
            <h3 class="text-[#9810FA] font-bold mb-3">🗓️ Cronograma</h3>
            <div class="space-y-2 text-sm">
              <p class="flex items-center"><span class="text-[#9810FA] font-bold mr-2">1.</span> Faça upload do seu relatório</p>
              <p class="flex items-center"><span class="text-[#9810FA] font-bold mr-2">2.</span> IA avalia automaticamente (24-48h)</p>
              <p class="flex items-center"><span class="text-[#9810FA] font-bold mr-2">3.</span> Receba resultado via email</p>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="text-center mb-6">
            <a href="https://mentoriza.com/submissions" class="inline-block bg-gradient-to-r from-[#9810FA] to-[#7a0f9f] text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition transform hover:scale-105">
              Acessar Submissão
            </a>
          </div>

          <!-- Footer Message -->
          <p class="text-gray-600 text-sm text-center">
            Alguma dúvida? Entre em contato com o coordenador de seu curso.
          </p>
        </div>

        <!-- Footer -->
        <div class="bg-gray-100 px-6 py-4 text-center text-sm text-gray-600">
          <p>© 2026 Mentoriza - Sistema de Gestão de Submissões</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

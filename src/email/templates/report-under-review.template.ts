import { ReportUnderReviewEmailData } from '../email.types';

export function generateReportUnderReviewTemplate(
  data: ReportUnderReviewEmailData,
): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <title>Relatório em Avaliação - Mentoriza</title>
    </head>
    <body class="bg-gray-100 m-0 p-0">
      <div class="bg-white max-w-2xl mx-auto my-8 rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white px-6 py-8">
          <h1 class="text-3xl font-bold">🔍 Relatório em Avaliação</h1>
          <p class="text-amber-100 mt-2">Sua submissão foi recebida</p>
        </div>

        <!-- Content -->
        <div class="px-6 py-8">
          <p class="text-gray-700 text-lg mb-6">
            Olá <span class="font-bold text-[#9810FA]">${data.groupName}</span>,
          </p>

          <p class="text-gray-600 mb-6">
            Seu relatório foi recebido com sucesso e está em processamento. 
            Uma inteligência artificial está analisando seu trabalho de acordo com os critérios estabelecidos.
          </p>

          <!-- Status Box -->
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-[#f59e0b] rounded-lg p-6 mb-6">
            <h3 class="text-amber-700 font-bold text-lg mb-4">⏳ Status da Avaliação</h3>
            
            <div class="space-y-3">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">✓</div>
                <span class="ml-3 text-gray-700"><span class="font-semibold">Recebido:</span> ${new Date().toLocaleDateString('pt-BR')}</span>
              </div>

              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center">
                  <span class="text-lg">⏳</span>
                </div>
                <span class="ml-3 text-gray-700"><span class="font-semibold">Em Processamento:</span> Aguardando análise</span>
              </div>

              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">?</div>
                <span class="ml-3 text-gray-600"><span class="font-semibold">Resultado:</span> Será enviado em breve</span>
              </div>
            </div>

            <p class="text-sm text-amber-700 mt-4 font-semibold">
              ⚡ Tempo estimado: 24-48 horas
            </p>
          </div>

          <!-- What We're Checking -->
          <div class="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 class="text-blue-800 font-bold text-lg mb-3">📋 O que estamos avaliando</h3>
            <ul class="space-y-2">
              <li class="flex items-center text-gray-700">
                <span class="text-[#9810FA] font-bold mr-2">✓</span>
                Conformidade com normas ABNT
              </li>
              <li class="flex items-center text-gray-700">
                <span class="text-[#9810FA] font-bold mr-2">✓</span>
                Originalidade e percentual de conteúdo gerado por IA
              </li>
              <li class="flex items-center text-gray-700">
                <span class="text-[#9810FA] font-bold mr-2">✓</span>
                Estrutura e qualidade do trabalho
              </li>
              <li class="flex items-center text-gray-700">
                <span class="text-[#9810FA] font-bold mr-2">✓</span>
                Citações e referências
              </li>
            </ul>
          </div>

          <!-- Info Box -->
          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border border-[#9810FA] border-opacity-30 rounded-lg p-4 mb-6">
            <p class="text-gray-700 text-sm">
              <span class="font-semibold">Submissão:</span> ${data.submissionName}
            </p>
            <p class="text-gray-600 text-sm mt-2">
              Você receberá um email assim que a avaliação for concluída com o resultado e pontuação.
            </p>
          </div>

          <!-- CTA Button -->
          <div class="text-center mb-6">
            <a href="https://mentoriza.com/dashboard" class="inline-block bg-gradient-to-r from-[#9810FA] to-[#7a0f9f] text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition transform hover:scale-105">
              Acompanhar Status
            </a>
          </div>

          <!-- Footer Message -->
          <p class="text-gray-600 text-sm text-center">
            Dúvidas? Entre em contato com o coordenador de seu curso.
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

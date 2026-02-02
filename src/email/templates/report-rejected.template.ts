import { ReportRejectedEmailData } from '../email.types';

export function generateReportRejectedTemplate(
  data: ReportRejectedEmailData,
): string {
  const reasonsList = data.reasons
    .map((r) => `<li class="text-gray-700">• ${r}</li>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <title>Relatório Rejeitado - Mentoriza</title>
    </head>
    <body class="bg-gray-100 m-0 p-0">
      <div class="bg-white max-w-2xl mx-auto my-8 rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-6 py-8">
          <h1 class="text-3xl font-bold">❌ Revisão Necessária</h1>
          <p class="text-red-100 mt-2">Seu relatório necessita de ajustes</p>
        </div>

        <!-- Content -->
        <div class="px-6 py-8">
          <p class="text-gray-700 text-lg mb-6">
            Olá <span class="font-bold text-[#9810FA]">${data.groupName}</span>,
          </p>

          <p class="text-gray-600 mb-6">
            A avaliação de seu relatório foi concluída. Infelizmente, o trabalho 
            não atendeu aos critérios de aceitação estabelecidos e foi <span class="font-semibold text-red-600">REJEITADO</span>.
          </p>

          <!-- Score Box -->
          <div class="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-500 rounded-lg p-6 mb-6">
            <h3 class="text-red-700 font-bold text-lg mb-4">📊 Avaliação</h3>
            
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-700 font-semibold">Pontuação:</span>
              <div class="flex items-center gap-2">
                <span class="text-4xl font-bold text-red-600">${data.score.toFixed(1)}</span>
                <span class="text-gray-600">/10</span>
              </div>
            </div>

            <div class="bg-white p-4 rounded border border-red-200">
              <p class="text-sm text-gray-600 mb-2"><span class="font-semibold">Submissão:</span> ${data.submissionName}</p>
              ${data.observations ? `<p class="text-sm text-gray-700 mt-2"><span class="font-semibold">Observações:</span> ${data.observations}</p>` : ''}
            </div>
          </div>

          <!-- Reasons for Rejection -->
          <div class="bg-orange-50 border-l-4 border-red-500 rounded-lg p-6 mb-6">
            <h3 class="text-red-700 font-bold text-lg mb-3">⚠️ Motivos da Rejeição</h3>
            <ul class="space-y-2">
              ${reasonsList}
            </ul>
          </div>

          <!-- Action Items -->
          <div class="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 class="text-blue-800 font-bold text-lg mb-3">📋 O que fazer agora</h3>
            <ul class="space-y-2">
              <li class="flex items-start text-gray-700">
                <span class="text-blue-600 font-bold mr-2">1.</span>
                Leia cuidadosamente os motivos da rejeição
              </li>
              <li class="flex items-start text-gray-700">
                <span class="text-blue-600 font-bold mr-2">2.</span>
                Consulte seus orientadores para orientação detalhada
              </li>
              <li class="flex items-start text-gray-700">
                <span class="text-blue-600 font-bold mr-2">3.</span>
                Realize as correções necessárias no relatório
              </li>
              <li class="flex items-start text-gray-700">
                <span class="text-blue-600 font-bold mr-2">4.</span>
                Resubmeta o trabalho para nova avaliação
              </li>
            </ul>
          </div>

          <!-- Support Message -->
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-[#9810FA] border-opacity-30 rounded-lg p-4 mb-6">
            <p class="text-gray-700">
              💡 Não desanime! Revise os pontos críticos e sua próxima submissão certamente terá melhores resultados. 
              Seus orientadores estão disponíveis para ajudar.
            </p>
          </div>

          <!-- CTA Button -->
          <div class="text-center mb-6">
            <a href="https://mentoriza.com/dashboard" class="inline-block bg-gradient-to-r from-[#9810FA] to-[#7a0f9f] text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition transform hover:scale-105">
              Ver Detalhes Completos
            </a>
          </div>
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

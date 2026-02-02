import { ReportApprovedEmailData } from '../email.types';

export function generateReportApprovedTemplate(
  data: ReportApprovedEmailData,
): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <title>Relatório Aprovado - Mentoriza</title>
    </head>
    <body class="bg-gray-100 m-0 p-0">
      <div class="bg-white max-w-2xl mx-auto my-8 rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-6 py-8">
          <h1 class="text-3xl font-bold">✅ Relatório Aprovado!</h1>
          <p class="text-green-100 mt-2">Parabéns pelo excelente trabalho</p>
        </div>

        <!-- Content -->
        <div class="px-6 py-8">
          <p class="text-gray-700 text-lg mb-6">
            Olá <span class="font-bold text-[#9810FA]">${data.groupName}</span>,
          </p>

          <p class="text-gray-600 mb-6">
            Sua submissão foi <span class="font-semibold text-green-600">APROVADA</span> com sucesso! 
            A avaliação foi concluída e seu trabalho atendeu a todos os critérios de aceitação.
          </p>

          <!-- Score Box -->
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-6 mb-6">
            <h3 class="text-green-700 font-bold text-lg mb-4">📊 Avaliação</h3>
            
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-700 font-semibold">Pontuação:</span>
              <div class="flex items-center gap-2">
                <span class="text-4xl font-bold text-green-600">${data.score.toFixed(1)}</span>
                <span class="text-gray-600">/10</span>
              </div>
            </div>

            <div class="bg-white p-4 rounded border border-green-200">
              <p class="text-sm text-gray-600 mb-2"><span class="font-semibold">Submissão:</span> ${data.submissionName}</p>
              ${data.observations ? `<p class="text-sm text-gray-700 mt-2"><span class="font-semibold">Observações:</span> ${data.observations}</p>` : ''}
            </div>
          </div>

          <!-- Success Message -->
          <div class="bg-gradient-to-r from-[#f0fdf4] to-[#f0fdf4] border-l-4 border-green-500 p-4 rounded mb-6">
            <p class="text-green-800">
              ✨ Seu trabalho demonstrou excelente qualidade, aderência às normas e originalidade. 
              Parabéns ao grupo pelo empenho dedicado!
            </p>
          </div>

          <!-- Next Steps -->
          <div class="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 class="text-blue-800 font-bold text-lg mb-3">📝 Próximos Passos</h3>
            <ul class="space-y-2">
              <li class="flex items-start text-gray-700">
                <span class="text-blue-600 font-bold mr-2">1.</span>
                Verifique os detalhes completos da avaliação na plataforma
              </li>
              <li class="flex items-start text-gray-700">
                <span class="text-blue-600 font-bold mr-2">2.</span>
                Aguarde novas submissões ou instruções do coordenador
              </li>
              <li class="flex items-start text-gray-700">
                <span class="text-blue-600 font-bold mr-2">3.</span>
                Mantenha contato com seus orientadores para feedback detalhado
              </li>
            </ul>
          </div>

          <!-- CTA Button -->
          <div class="text-center mb-6">
            <a href="https://mentoriza.com/dashboard" class="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition transform hover:scale-105">
              Ver Detalhes
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

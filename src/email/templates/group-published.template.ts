import { GroupPublishedEmailData } from '../email.types';

export function generateGroupPublishedTemplate(
  data: GroupPublishedEmailData,
): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <title>Grupo Publicado - Mentoriza</title>
    </head>
    <body class="bg-gray-100 m-0 p-0">
      <div class="bg-white max-w-2xl mx-auto my-8 rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-[#9810FA] to-[#7a0f9f] text-white px-6 py-8">
          <h1 class="text-3xl font-bold">Bem-vindo ao Mentoriza!</h1>
          <p class="text-indigo-100 mt-2">Sua participação começou</p>
        </div>

        <!-- Content -->
        <div class="px-6 py-8">
          <p class="text-gray-700 text-lg mb-6">
            Olá <span class="font-bold text-[#9810FA]">${data.studentName}</span>,
          </p>

          <p class="text-gray-600 mb-6">
            Parabéns! Seu grupo foi <span class="font-semibold">publicado</span> e suas credenciais estão prontas. Você pode agora acessar a plataforma com seus dados de login.
          </p>

          <!-- Credentials Box -->
          <div class="bg-gradient-to-br from-[#f3f0ff] to-[#faf5ff] border-2 border-[#9810FA] rounded-lg p-6 mb-6">
            <h3 class="text-[#9810FA] font-bold text-lg mb-4">📋 Suas Credenciais</h3>
            
            <div class="space-y-3 mb-6">
              <div class="bg-white p-3 rounded border border-[#9810FA] border-opacity-30">
                <p class="text-sm text-gray-600 font-semibold">Email:</p>
                <p class="text-[#9810FA] font-mono text-lg">${data.email}</p>
              </div>
              
              <div class="bg-white p-3 rounded border border-[#9810FA] border-opacity-30">
                <p class="text-sm text-gray-600 font-semibold">Senha Temporária:</p>
                <p class="text-[#9810FA] font-mono text-lg">${data.password}</p>
              </div>

              <p class="text-sm text-red-600 mt-3">
                ⚠️ Recomendamos alterar sua senha no primeiro acesso
              </p>
            </div>
          </div>

          <!-- Group Info -->
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 class="text-gray-800 font-bold text-lg mb-4">👥 Informações do Grupo</h3>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 font-semibold">Grupo:</p>
                <p class="text-gray-800">${data.groupName}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-600 font-semibold">Curso:</p>
                <p class="text-gray-800">${data.courseCode}</p>
              </div>

              ${
                data.studentRA
                  ? `
              <div>
                <p class="text-sm text-gray-600 font-semibold">RA:</p>
                <p class="text-gray-800">${data.studentRA}</p>
              </div>
              `
                  : ''
              }
            </div>
          </div>

          <!-- Advisors Info -->
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 class="text-gray-800 font-bold text-lg mb-4">🎓 Orientadores</h3>
            
            <div class="space-y-3">
              <div class="flex items-start">
                <span class="text-[#9810FA] font-bold mr-3">📌</span>
                <div>
                  <p class="font-semibold text-gray-800">${data.advisorName}</p>
                  <p class="text-sm text-gray-600">Orientador</p>
                  ${data.advisorEmail ? `<p class="text-sm text-[#9810FA]">${data.advisorEmail}</p>` : ''}
                </div>
              </div>

              ${
                data.coAdvisorName
                  ? `
              <div class="flex items-start">
                <span class="text-[#9810FA] font-bold mr-3">📌</span>
                <div>
                  <p class="font-semibold text-gray-800">${data.coAdvisorName}</p>
                  <p class="text-sm text-gray-600">Co-orientador</p>
                  ${data.coAdvisorEmail ? `<p class="text-sm text-[#9810FA]">${data.coAdvisorEmail}</p>` : ''}
                </div>
              </div>
              `
                  : ''
              }
            </div>
          </div>

          <!-- CTA Button -->
          <div class="text-center mb-6">
            <a href="https://mentoriza.com/login" class="inline-block bg-gradient-to-r from-[#9810FA] to-[#7a0f9f] text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition transform hover:scale-105">
              Acessar Plataforma
            </a>
          </div>

          <!-- Footer Message -->
          <p class="text-gray-600 text-sm text-center">
            Se tiver dúvidas, entre em contato com o coordenador de seu curso.
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

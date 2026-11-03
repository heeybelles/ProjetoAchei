describe('3. Jornada do Aluno (Home, Wizard, Notificações, Perfil e Reivindicação)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
    cy.visit('/login');
    cy.contains('li', 'Aluno').contains('button', 'Preencher').click();
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/home');
  });

  it('deve exibir o painel do aluno com estatísticas, alertas de prazo e navegação', () => {
    cy.contains('h1', 'Olá, Maria!').should('be.visible');
    cy.contains('Você tem objetos para entregar na biblioteca').should('be.visible');
    cy.get('section[aria-label="Resumo"]').should('be.visible');

    // Impedir acesso do aluno à rota /biblioteca
    cy.visit('/biblioteca');
    cy.url().should('include', '/home');
  });

  it('deve cadastrar um novo comunicado pelo Wizard (Perdido e Encontrado)', () => {
    cy.contains('button', 'Perdi um objeto').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('Etapa 2 de 3: Informações').should('be.visible');

    // Testar validação na etapa 2
    cy.contains('button', 'Continuar').click();
    cy.contains('Informe o nome do objeto').should('be.visible');

    // Preencher dados sem perder foco no modal
    cy.contains('label', 'Nome do objeto').parent().find('input').type('Calculadora científica');
    cy.contains('label', 'Categoria').parent().find('select').select('Eletrônicos');
    cy.contains('label', 'Local onde foi perdido').parent().find('select').select('Bloco de salas');
    cy.contains('label', 'Descrição pública').parent().find('textarea').type('Calculadora perdida após a aula de estatística.');
    cy.contains('label', 'Descrição detalhada').parent().find('textarea').type('Calculadora Casio fx-82MS preta com capa deslizante.');
    cy.contains('label', 'Características específicas').parent().find('textarea').type('Adesivo redondo azul no verso.');

    cy.contains('button', 'Continuar').click();
    cy.contains('Etapa 3 de 3: Confirmação').should('be.visible');
    cy.contains('Calculadora científica').should('be.visible');
    cy.contains('button', 'Publicar comunicado').click();

    cy.contains('Comunicado publicado com sucesso!').should('be.visible');
    cy.contains('a', 'Ver meus comunicados').click();
    cy.url().should('include', '/perfil#comunicados');
    cy.contains('h3', 'Calculadora científica').should('be.visible');
  });

  it('deve permitir filtrar e marcar notificações como lidas', () => {
    cy.visit('/notificacoes');
    cy.contains('h1', 'Notificações').should('be.visible');
    cy.contains('Você tem 4 avisos não lidos.').should('be.visible');

    cy.contains('[role="tab"]', 'Não lidas (4)').click();
    cy.get('main ul > li').should('have.length', 4);

    cy.contains('button', 'Marcar como lida').first().click();
    cy.contains('Você tem 3 avisos não lidos.').should('be.visible');

    cy.contains('button', 'Marcar todas como lidas').click();
    cy.contains('Você está em dia com seus avisos.').should('be.visible');
  });

  it('deve editar perfil, alterar senha no modal sem perder foco e consultar Meus Comunicados', () => {
    cy.visit('/perfil');
    cy.contains('h1', 'Perfil').should('be.visible');

    // Editar perfil
    cy.contains('button', 'Editar').click();
    cy.contains('label', 'Nome completo').parent().find('input').clear().type('Maria Clara Souza');
    cy.contains('button', 'Salvar alterações').click();
    cy.contains('Perfil atualizado com sucesso.').should('be.visible');
    cy.contains('h2', 'Maria Clara Souza').should('be.visible');

    // Alterar senha (testando foco contínuo nos inputs dentro do Modal)
    cy.contains('button', 'Alterar senha').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('label', 'Senha atual').parent().find('input').type('aluno123');
    cy.contains('label', 'Nova senha').parent().find('input').type('novaSenha123');
    cy.contains('label', 'Confirmar nova senha').parent().find('input').type('novaSenha123');
    cy.contains('button', 'Salvar nova senha').click();
    cy.contains('Senha alterada').should('be.visible');
  });

  it('deve permitir solicitar reivindicação de um objeto encontrado por outro aluno', () => {
    cy.visit('/comunicados');
    cy.get('input[aria-label="Buscar comunicados"]').type('Caderno universitário');
    cy.contains('button', 'Ver detalhes').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('button', 'Acredito que este objeto é meu').click();
    cy.contains('Solicitação enviada!').should('be.visible');
  });
});

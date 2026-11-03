describe('4. Jornada da Biblioteca (Dashboard, Comunicados, Recebimentos, Solicitações, Inventário, Destinação, Configurações)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
    cy.visit('/login');
    cy.contains('li', 'Funcionário (biblioteca)').contains('button', 'Preencher').click();
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/biblioteca');
  });

  it('deve exibir indicadores e navegar entre todas as abas e pelo logo', () => {
    cy.contains('h1', 'Painel da biblioteca').should('be.visible');
    cy.contains('entregas atrasadas').should('be.visible');

    // Clicar em indicador de Comunicados pendentes
    cy.contains('button', 'Comunicados pendentes').click();
    cy.contains('h1', 'Comunicados').should('be.visible');

    // Testar encerramento de comunicado com digitação no modal
    cy.contains('li', 'Mochila').contains('button', 'Encerrar').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"] textarea').type('Aluno encontrou a mochila em casa.');
    cy.get('[role="dialog"] textarea').should('have.value', 'Aluno encontrou a mochila em casa.');
    cy.get('[role="dialog"]').contains('button', 'Encerrar comunicado').click();
    cy.contains('Comunicado encerrado.').should('be.visible');
  });

  it('deve confirmar recebimento físico de objeto encontrado', () => {
    cy.get('nav[aria-label="Seções da biblioteca"]').contains('button', 'Recebimentos').click();
    cy.contains('h1', 'Recebimentos').should('be.visible');

    cy.contains('li', 'Fone de ouvido').contains('button', 'Confirmar recebimento').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"] textarea').type('Recebido no balcão principal, armário 1.');
    cy.get('[role="dialog"] textarea').should('have.value', 'Recebido no balcão principal, armário 1.');
    cy.get('[role="dialog"]').contains('button', 'Confirmar recebimento').click();
    cy.contains('Recebimento de "Fone de ouvido" confirmado.').should('be.visible');
  });

  it('deve validar propriedade e registrar devolução em Solicitações', () => {
    cy.get('nav[aria-label="Seções da biblioteca"]').contains('button', 'Solicitações').click();
    cy.contains('h1', 'Solicitações de retirada').should('be.visible');

    // Validar propriedade de Carregador portátil
    cy.contains('li', 'Carregador portátil').contains('button', 'Validar propriedade').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"] input[type="checkbox"]').first().check();
    cy.get('[role="dialog"] input[type="checkbox"]').last().check();
    cy.get('[role="dialog"] textarea').type('Aluna informou etiqueta Mari no verso.');
    cy.get('[role="dialog"] textarea').should('have.value', 'Aluna informou etiqueta Mari no verso.');
    cy.get('[role="dialog"]').contains('button', 'Aprovar').click();
    cy.contains('Propriedade validada.').should('be.visible');

    // Registrar devolução do item aprovado
    cy.contains('li', 'Carregador portátil').contains('button', 'Registrar devolução').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"] textarea').type('Entregue mediante apresentação de RA.');
    cy.get('[role="dialog"]').contains('button', 'Confirmar devolução').click();
    cy.contains('Devolução registrada.').should('be.visible');
  });

  it('deve disponibilizar item no Inventário e gerenciar Destinação e Configurações', () => {
    // Inventário
    cy.get('nav[aria-label="Seções da biblioteca"]').contains('button', 'Inventário').click();
    cy.contains('h1', 'Inventário').should('be.visible');
    cy.contains('li', 'Estojo').contains('button', 'Disponibilizar para retirada').click();
    cy.contains('"Estojo" disponível para retirada.').should('be.visible');

    // Destinação
    cy.get('nav[aria-label="Seções da biblioteca"]').contains('button', 'Destinação').click();
    cy.contains('h1', 'Destinação').should('be.visible');
    cy.contains('li', 'Caderno universitário').contains('button', 'Prorrogar 30 dias').click();
    cy.contains('Permanência prorrogada em 30 dias.').should('be.visible');

    cy.contains('li', 'Casaco').contains('button', 'Registrar análise e destinação').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"] select').select(1);
    cy.get('[role="dialog"] textarea').type('Prazo de 90 dias expirado sem procura.');
    cy.get('[role="dialog"] textarea').should('have.value', 'Prazo de 90 dias expirado sem procura.');
    cy.get('[role="dialog"]').contains('button', 'Registrar e encerrar').click();
    cy.contains('Destinação registrada e comunicado encerrado.').should('be.visible');

    // Configurações (feriados)
    cy.get('nav[aria-label="Seções da biblioteca"]').contains('button', 'Configurações').click();
    cy.contains('h1', 'Configurações').should('be.visible');
    cy.contains('label', 'Data').parent().find('input').type('2026-11-15');
    cy.contains('label', 'Nome').parent().find('input').type('Proclamação da República');
    cy.contains('button', 'Adicionar').click();
    cy.contains('Feriado cadastrado.').should('be.visible');
    cy.contains('li', 'Proclamação da República').should('be.visible');
  });
});

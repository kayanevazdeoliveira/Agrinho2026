// script.js

// ==================== ACESSIBILIDADE ====================

// Elementos do DOM
const btnAcessibilidade = document.getElementById('btnAcessibilidade');
const painelAcessibilidade = document.getElementById('painelAcessibilidade');
const btnAumentar = document.getElementById('aumentarFonte');
const btnDiminuir = document.getElementById('diminuirFonte');
const btnContraste = document.getElementById('altoContraste');
const btnAudio = document.getElementById('audioDescricao');
const btnFecharPainel = document.getElementById('fecharPainel');

// Abrir/fechar painel de acessibilidade
btnAcessibilidade.addEventListener('click', () => {
    if (painelAcessibilidade.style.display === 'flex') {
        painelAcessibilidade.style.display = 'none';
    } else {
        painelAcessibilidade.style.display = 'flex';
    }
});

btnFecharPainel.addEventListener('click', () => {
    painelAcessibilidade.style.display = 'none';
});

// Aumentar fonte
let tamanhoFonteAtual = 100; // em porcentagem
btnAumentar.addEventListener('click', () => {
    if (tamanhoFonteAtual < 140) {
        tamanhoFonteAtual += 10;
        document.body.style.fontSize = tamanhoFonteAtual + '%';
    }
});

// Diminuir fonte
btnDiminuir.addEventListener('click', () => {
    if (tamanhoFonteAtual > 80) {
        tamanhoFonteAtual -= 10;
        document.body.style.fontSize = tamanhoFonteAtual + '%';
    }
});

// Alto contraste
let contrasteAtivo = false;
btnContraste.addEventListener('click', () => {
    if (contrasteAtivo) {
        document.body.classList.remove('alto-contraste');
        contrasteAtivo = false;
    } else {
        document.body.classList.add('alto-contraste');
        contrasteAtivo = true;
    }
});

// Áudio descrição do site (Web Speech API)
btnAudio.addEventListener('click', () => {
    if ('speechSynthesis' in window) {
        const textoParaLer = `
            Bem-vindo ao site AgroIntegra. 
            Este site apresenta o Efeito Poupa-Terra e a Integração Lavoura-Pecuária-Floresta para reduzir o desmatamento. 
            O objetivo é conscientizar sobre o uso sustentável das terras. 
            O site possui seções sobre objetivo, problema da má utilização das terras, o que é ILPF, o jogo da gestão sustentável, e como aplicar na prática.
            Use o jogo arrastando os ícones de lavoura, pecuária e floresta para as áreas corretas.
        `;
        const utterance = new SpeechSynthesisUtterance(textoParaLer);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        window.speechSynthesis.cancel(); // para não acumular
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Seu navegador não suporta áudio descrição.');
    }
});

// ==================== JOGO DRAG AND DROP ====================

// Elementos do jogo
const elementosArrastaveis = document.querySelectorAll('.elemento-dragao');
const areasIntegracao = document.querySelectorAll('.area-integracao');
const feedbackJogo = document.getElementById('feedbackJogo');
const btnReiniciar = document.getElementById('reiniciarJogo');

// Estado do jogo: quais elementos já foram colocados corretamente
let elementosColocados = {
    lavoura: false,
    pecuaria: false,
    floresta: false
};

// Função para verificar se o jogo foi concluído
function verificarConclusao() {
    if (elementosColocados.lavoura && elementosColocados.pecuaria && elementosColocados.floresta) {
        feedbackJogo.innerHTML = '🎉 PARABÉNS! 🎉 Você completou a integração ILPF! Este é o Efeito "Poupa-Terra": lavoura, pecuária e floresta juntos, sem desmatamento! 🌱🐄🌳';
        feedbackJogo.style.backgroundColor = '#2d6a4f';
        feedbackJogo.style.color = 'white';
    }
}

// Configurar os elementos arrastáveis
elementosArrastaveis.forEach(el => {
    el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', el.getAttribute('data-tipo'));
        e.dataTransfer.effectAllowed = 'copy';
        el.style.opacity = '0.5';
    });
    
    el.addEventListener('dragend', (e) => {
        el.style.opacity = '1';
    });
});

// Configurar as áreas de destino (drop zones)
areasIntegracao.forEach(area => {
    area.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessário para permitir drop
        e.dataTransfer.dropEffect = 'copy';
        area.classList.add('drag-over');
    });
    
    area.addEventListener('dragleave', () => {
        area.classList.remove('drag-over');
    });
    
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('drag-over');
        
        const tipoElemento = e.dataTransfer.getData('text/plain');
        const tipoArea = area.getAttribute('data-elemento');
        
        // Verifica se o elemento já foi colocado antes
        if (elementosColocados[tipoElemento]) {
            feedbackJogo.innerHTML = `⚠️ O elemento ${tipoElemento} já foi posicionado! Use o botão Reiniciar para jogar novamente.`;
            feedbackJogo.style.backgroundColor = '#c49a6c';
            feedbackJogo.style.color = '#283618';
            return;
        }
        
        // Verifica se o elemento corresponde à área
        if (tipoElemento === tipoArea) {
            // Colocação correta
            elementosColocados[tipoElemento] = true;
            
            // Esconde o elemento arrastável correspondente
            const elementoArrastavel = document.querySelector(`.elemento-dragao[data-tipo="${tipoElemento}"]`);
            if (elementoArrastavel) {
                elementoArrastavel.classList.add('oculto');
            }
            
            // Adiciona o ícone na área de integração
            const divColocada = area.querySelector('.elemento-colocado');
            let icone = '';
            let texto = '';
            if (tipoElemento === 'lavoura') {
                icone = '🌾🌽 ';
                texto = 'Lavoura integrada!';
            } else if (tipoElemento === 'pecuaria') {
                icone = '🐄🐮 ';
                texto = 'Pecuária integrada!';
            } else if (tipoElemento === 'floresta') {
                icone = '🌳🌲 ';
                texto = 'Floresta integrada!';
            }
            divColocada.innerHTML = `${icone} ${texto}`;
            
            feedbackJogo.innerHTML = `✅ Correto! ${tipoElemento} foi integrado(a) com sucesso! Continue assim.`;
            feedbackJogo.style.backgroundColor = '#52b788';
            feedbackJogo.style.color = 'white';
            
            // Verifica se o jogo terminou
            verificarConclusao();
        } else {
            // Colocação errada - aparece um X e o símbolo volta (já que não movemos o elemento)
            feedbackJogo.innerHTML = `❌ Errado! ${tipoElemento} não pertence a esta área. Tente novamente.`;
            feedbackJogo.style.backgroundColor = '#e9c46a';
            feedbackJogo.style.color = '#283618';
            // Mostra X temporário na área
            const xTemp = document.createElement('div');
            xTemp.textContent = '❌';
            xTemp.style.fontSize = '2rem';
            xTemp.style.position = 'absolute';
            xTemp.style.opacity = '0.8';
            area.style.position = 'relative';
            area.appendChild(xTemp);
            setTimeout(() => {
                xTemp.remove();
            }, 800);
        }
        
        setTimeout(() => {
            if (!(elementosColocados.lavoura && elementosColocados.pecuaria && elementosColocados.floresta)) {
                feedbackJogo.style.backgroundColor = '#e9ecef';
                feedbackJogo.style.color = '#283618';
                if (feedbackJogo.innerHTML.includes('Correto')) {
                    feedbackJogo.innerHTML = 'Continue arrastando os elementos!';
                }
            }
        }, 2000);
    });
});

// Botão reiniciar jogo
btnReiniciar.addEventListener('click', () => {
    // Resetar estado
    elementosColocados = {
        lavoura: false,
        pecuaria: false,
        floresta: false
    };
    
    // Mostrar novamente todos os elementos arrastáveis
    elementosArrastaveis.forEach(el => {
        el.classList.remove('oculto');
    });
    
    // Limpar as áreas de integração
    areasIntegracao.forEach(area => {
        const divColocada = area.querySelector('.elemento-colocado');
        divColocada.innerHTML = '';
    });
    
    // Resetar feedback
    feedbackJogo.innerHTML = 'Jogo reiniciado! Arraste cada ícone para a área correta de integração.';
    feedbackJogo.style.backgroundColor = '#e9ecef';
    feedbackJogo.style.color = '#283618';
});

// ==================== FECHAR PAINEL AO CLICAR FORA ====================
document.addEventListener('click', (event) => {
    if (!btnAcessibilidade.contains(event.target) && !painelAcessibilidade.contains(event.target)) {
        if (painelAcessibilidade.style.display === 'flex') {
            painelAcessibilidade.style.display = 'none';
        }
    }
});

// Mensagem inicial no console para estudantes
console.log('Site AgroIntegra carregado! Use o botão de acessibilidade no canto inferior direito.');

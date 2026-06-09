// ============================================
// SCRIPT - AgroIntegra
// Funcionalidades: Acessibilidade + Simulador "Poupa-Terra"
// Baseado no planejamento original da estudante
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ========== MENU DE ACESSIBILIDADE ==========
    const btnAcessibilidade = document.getElementById('btnAcessibilidade');
    const menuAcessibilidade = document.getElementById('menuAcessibilidade');
    
    if (btnAcessibilidade) {
        btnAcessibilidade.addEventListener('click', function() {
            if (menuAcessibilidade.style.display === 'none' || menuAcessibilidade.style.display === '') {
                menuAcessibilidade.style.display = 'flex';
            } else {
                menuAcessibilidade.style.display = 'none';
            }
        });
    }
    
    // Aumentar fonte
    const aumentarFonteBtn = document.getElementById('aumentarFonte');
    let tamanhoFonteAtual = 100;
    
    if (aumentarFonteBtn) {
        aumentarFonteBtn.addEventListener('click', function() {
            if (tamanhoFonteAtual < 140) {
                tamanhoFonteAtual += 10;
                document.body.style.fontSize = tamanhoFonteAtual + '%';
            }
        });
    }
    
    // Diminuir fonte
    const diminuirFonteBtn = document.getElementById('diminuirFonte');
    if (diminuirFonteBtn) {
        diminuirFonteBtn.addEventListener('click', function() {
            if (tamanhoFonteAtual > 70) {
                tamanhoFonteAtual -= 10;
                document.body.style.fontSize = tamanhoFonteAtual + '%';
            }
        });
    }
    
    // Alto contraste
    const altoContrasteBtn = document.getElementById('altoContraste');
    if (altoContrasteBtn) {
        altoContrasteBtn.addEventListener('click', function() {
            document.body.classList.toggle('alto-contraste');
        });
    }
    
    // ========== SIMULADOR "POUPA-TERRA" (FUNCIONALIDADE PRINCIPAL) ==========
    // O usuário escolhe 3 produtos para plantar na mesma área, sem desmatar
    
    const botaoSimular = document.getElementById('simularBtn');
    const inputHectares = document.getElementById('hectares');
    const resultadoDiv = document.getElementById('resultadoSimulador');
    const checkboxesProdutos = document.querySelectorAll('input[name="produto"]');
    
    // Dicionário com benefícios de cada produto sustentável
    const beneficiosProdutos = {
        soja: "🌿 Soja com rotação de cultura: recupera o solo e evita pragas.",
        milho: "🌽 Milho consorciado com braquiária: produz palha para o solo e alimenta o gado.",
        cafe: "☕ Café sombreado por árvores: protege nascentes e atrai pássaros.",
        gado: "🐄 Gado em ILPF: pastagem recuperada + árvores que dão sombra e sequestram carbono.",
        eucalipto: "🌳 Eucalipto em integração: fornece madeira sem derrubar floresta nativa.",
        feijao: "🫘 Feijão no plantio direto: evita erosão e mantém a terra viva."
    };
    
    function simularPoupaTerra() {
        // 1. Pegar os produtos selecionados
        let produtosSelecionados = [];
        checkboxesProdutos.forEach(checkbox => {
            if (checkbox.checked) {
                produtosSelecionados.push(checkbox.value);
            }
        });
        
        // 2. Validar: precisa de exatamente 3 produtos
        if (produtosSelecionados.length !== 3) {
            resultadoDiv.innerHTML = `
                <p>⚠️ <strong>Você selecionou ${produtosSelecionados.length} produto(s).</strong></p>
                <p>O Efeito "Poupa-Terra" funciona melhor com <strong>3 produtos diferentes</strong> plantados na mesma área, em rotação ou integração.</p>
                <p>🌱 Selecione exatamente 3 opções para simular uma ILPF completa!</p>
            `;
            return;
        }
        
        // 3. Pegar área em hectares
        let hectares = parseFloat(inputHectares.value);
        if (isNaN(hectares) || hectares <= 0) {
            resultadoDiv.innerHTML = `<p>⚠️ Por favor, digite uma área válida em hectares.</p>`;
            return;
        }
        
        // 4. Calcular o "Poupa-Terra": economia de área em relação ao sistema tradicional
        // Sistema tradicional precisaria de 3x mais área para produzir as 3 culturas separadamente
        let areaEconomizada = hectares * 2; // área que NÃO precisou ser desmatada
        let reducaoCO2 = areaEconomizada * 3.5; // cada hectare poupado = 3.5 ton CO2/ano
        
        // 5. Montar mensagem personalizada
        let listaBeneficios = "";
        produtosSelecionados.forEach(produto => {
            if (beneficiosProdutos[produto]) {
                listaBeneficios += `<li>${beneficiosProdutos[produto]}</li>`;
            }
        });
        
        // Nomes bonitos dos produtos selecionados
        const nomesProdutos = {
            soja: "Soja", milho: "Milho", cafe: "Café", 
            gado: "Gado (Pecuária)", eucalipto: "Eucalipto", feijao: "Feijão"
        };
        let nomesSelecionados = produtosSelecionados.map(p => nomesProdutos[p] || p).join(", ");
        
        resultadoDiv.innerHTML = `
            <p><strong>🌾 RESULTADO DO EFEITO "POUPA-TERRA" 🌾</strong></p>
            <p>✅ Você integrou na mesma área de <strong>${hectares} hectares</strong>:</p>
            <p><strong>📦 ${nomesSelecionados}</strong></p>
            
            <ul style="text-align: left; margin: 15px 0;">
                ${listaBeneficios}
            </ul>
            
            <p><strong>📊 Números da sustentabilidade:</strong></p>
            <ul style="text-align: left;">
                <li>🌱 Área economizada (NÃO desmatada): <strong>${areaEconomizada} hectares</strong></li>
                <li>💨 Redução de CO₂ por ano: <strong>${reducaoCO2.toFixed(1)} toneladas</strong></li>
                <li>🌳 Equivalente a plantar: <strong>${Math.round(reducaoCO2 * 45)} árvores</strong></li>
            </ul>
            
            <p style="margin-top: 15px; background: #2d5a27; color: white; padding: 10px; border-radius: 12px;">
            ✨ <strong>Parabéns!</strong> Você aplicou o Efeito "Poupa-Terra": produziu mais, sem desmatar! ✨
            </p>
        `;
    }
    
    // Adicionar evento ao botão
    if (botaoSimular) {
        botaoSimular.addEventListener('click', simularPoupaTerra);
    }
    
    console.log('🌱 AgroIntegra carregado! Simulador "Poupa-Terra" ativo - ILPF e sinergia para o futuro sustentável.');
});

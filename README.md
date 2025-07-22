
<script type="text/javascript">
        var gk_isXlsx = false;
        var gk_xlsxFileLookup = {};
        var gk_fileData = {};
        function filledCell(cell) {
          return cell !== '' && cell != null;
        }
        function loadFileData(filename) {
        if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
            try {
                var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
                var firstSheetName = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[firstSheetName];

                // Convert sheet to JSON to filter blank rows
                var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
                // Filter out blank rows (rows where all cells are empty, null, or undefined)
                var filteredData = jsonData.filter(row => row.some(filledCell));

                // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
                var headerRowIndex = filteredData.findIndex((row, index) =>
                  row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
                );
                // Fallback
                if (headerRowIndex === -1 || headerRowIndex > 25) {
                  headerRowIndex = 0;
                }

                // Convert filtered JSON back to CSV
                var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
                csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
                return csv;
            } catch (e) {
                console.error(e);
                return "";
            }
        }
        return gk_fileData[filename] || "";
        }
        </script><!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📅 Cronograma INEP 2025/2</title>
<link rel="icon" href="https://cdn-icons-png.flaticon.com/512/3771/3771323.png" type="image/png">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f4;
            position: relative;
        }
        h2 {
            color: #333;
            text-align: center;
            margin-bottom: 10px;
            font-size: 2em;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .countdown-container {
            text-align: center;
            margin-bottom: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        .countdown-container p {
            font-size: 1.2em;
            margin: 0;
        }
        .countdown-container span {
            font-weight: bold;
            font-size: 1.4em;
        }
        .progress-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto 10px;
            text-align: center;
        }
        .progress-bar {
            width: 100%;
            background-color: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
            height: 20px;
            margin-top: 10px;
        }
        .progress-fill {
            height: 100%;
            background-color: #4CAF50;
            width: 0%;
            transition: width 0.3s ease-in-out;
        }
        .progress-text {
            font-size: 1em;
            color: #333;
            font-weight: bold;
        }
        .motivational-quote {
            text-align: center;
            font-style: italic;
            color: #2c3e50;
            margin: 10px 0;
            font-size: 1.1em;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            animation: fadeIn 1s ease-in;
        }
        @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
            background-color: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #4CAF50;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        .rest-row {
            background-color: #e0e0e0;
            font-weight: bold;
        }
        .week-header {
            font-size: 1.2em;
            margin-top: 30px;
            color: #2c3e50;
            padding: 10px;
            border-radius: 5px;
            background-color: #e8f4f8;
            transition: all 0.3s ease;
        }
        .week-completed {
            text-decoration: line-through;
            color: #888;
            background-color: #d4edda;
        }
        .extra-week {
            background-color: #fff3cd;
        }
        .topic {
            display: flex;
            align-items: center;
        }
        .topic input[type="checkbox"] {
            margin-right: 10px;
            transform: scale(1.2);
        }
        .completed {
            text-decoration: line-through;
            color: #888;
        }
        .celebration-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3em;
            color: #4CAF50;
            background-color: rgba(255, 255, 255, 0.9);
            padding: 20px 40px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            z-index: 1000;
            display: none;
            animation: celebrate 1s ease;
        }
        @keyframes celebrate {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        .blur {
            filter: blur(3px);
            transition: filter 0.3s ease;
        }
    
body.dark-mode {
    background-color: #121212;
    color: #e0e0e0;
}
body.dark-mode .week-header {
    background-color: #333 !important;
    color: #fff !important;
}
body.dark-mode table {
    background-color: #1e1e1e;
}
body.dark-mode th {
    background-color: #444;
}
body.dark-mode td {
    background-color: #2a2a2a;
}
body.dark-mode .rest-row {
    background-color: #444 !important;
}

</style>
</head>
<body>
    <h2>🗓️ Cronograma Revalida/Enamed 2025</h2>
<div style="text-align: center; margin: 20px 0;">
    <button onclick="resetProgresso()" style="margin:5px; padding:10px; background-color:#e74c3c; color:#fff; border:none; border-radius:6px; cursor:pointer;">
        🔄 Resetar Todo o Progresso
    </button>
    <button onclick="window.print()" style="margin:5px; padding:10px; background-color:#3498db; color:#fff; border:none; border-radius:6px; cursor:pointer;">
        🖨️ Imprimir / Gerar PDF
    </button>
    <button id="darkModeToggle" style="margin:5px; padding:10px; background-color:#222; color:#fff; border:none; border-radius:6px; cursor:pointer;">
        🌙 Ativar Modo Escuro
    </button>
    <select id="filtroArea" style="margin:5px; padding:10px; border-radius:6px;">
        <option value="todas">🔎 Ver Todas as Áreas</option>
        <option value="🟩">🟩 Preventiva</option>
        <option value="🟥">🟥 Clínica</option>
        <option value="🟦">🟦 Pediatria</option>
        <option value="🟪">🟪 Gineco/Obstetrícia</option>
        <option value="🟧">🟧 Cirurgia</option>
        <option value="🧠">🧠 Psiquiatria</option>
    </select>
</div>

    <div class="countdown-container">
        <p>Tempo até 19/10/2025: <span id="countdown">Carregando...</span></p>
    </div>
    <div class="progress-container">
        <div class="progress-text">Progresso: <span id="progress-percentage">0%</span></div>
        <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
        </div>
    </div>
    <div class="motivational-quote" id="motivational-quote"></div>
    <div class="celebration-message" id="celebration-message">Parabéns! Semana Concluída! 🎉</div>

    <!-- Semana 1 -->
    <div class="week-header" data-week="1">🗓️ Semana 1 – Aclimatação</div>
    <table data-week="1">
        <tr>
            <th>📆 Data</th>
            <th>📚 Tema</th>
            <th>🩺 Área</th>
        </tr>
        <tr>
            <td>✅ 28/07 (Seg)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s1-1"> <span>Processo Saúde-Doença</span></div></td>
            <td>🟩 Preventiva</td>
        </tr>
        <tr>
            <td>✅ 29/07 (Ter)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s1-2"> <span>Aleitamento Materno</span></div></td>
            <td>🟦 Pediatria</td>
        </tr>
        <tr>
            <td>✅ 30/07 (Qua)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s1-3"> <span>Ética Médica – Aspectos Gerais</span></div></td>
            <td>🟩 Preventiva</td>
        </tr>
        <tr>
            <td>✅ 31/07 (Qui)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s1-4"> <span>Assistência Pré-Natal</span></div></td>
            <td>🟪 Obstetrícia</td>
        </tr>
        <tr>
            <td>✅ 01/08 (Sex)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s1-5"> <span>Hipertensão Arterial Sistêmica</span></div></td>
            <td>🟥 Clínica Médica</td>
        </tr>
        <tr>
            <td>✅ 02/08 (Sáb)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s1-6"> <span>Técnica Cirúrgica e Corpo Estranho</span></div></td>
            <td>🟧 Cirurgia</td>
        </tr>
        <tr class="rest-row">
            <td>💤 03/08 (Dom)</td>
            <td><strong>DESCANSO</strong></td>
            <td>—</td>
        </tr>
    </table>

    <!-- Semana 2 -->
    <div class="week-header" data-week="2">🗓️ Semana 2 – Ritmo Moderado</div>
    <table data-week="2">
        <tr>
            <th>📆 Data</th>
            <th>📚 Tema 1</th>
            <th>Área 1</th>
            <th>📚 Tema 2</th>
            <th>Área 2</th>
        </tr>
        <tr>
            <td>✅ 05/08 (Seg)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s2-1-1"> <span>SUS</span></div></td>
            <td>🟩 Preventiva</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s2-1-2"> <span>Diarreia e Desidratação</span></div></td>
            <td>🟦 Pediatria</td>
        </tr>
        <tr>
            <td>✅ 06/08 (Ter)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s2-2-1"> <span>Câncer de Colo de Útero e HPV</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s2-2-2"> <span>DPOC</span></div></td>
            <td>🟥 Clínica</td>
        </tr>
        <tr>
            <td>✅ 07/08 (Qua)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s2-3-1"> <span>Ética – Sigilo e Informações Médicas</span></div></td>
            <td>🟩 Preventiva</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s2-3-2"> <span>Queimaduras</span></div></td>
            <td>🟧 Cirurgia</td>
        </tr>
        <tr>
            <td>✅ 08/08 (Qui)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s2-4-1"> <span>Infecção do Trato Urinário</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s2-4-2"> <span>Planejamento Familiar</span></div></td>
            <td>🟪 Ginecologia</td>
        </tr>
        <tr>
            <td>✅ 09/08 (Sex)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s2-5-1"> <span>Mecanismo de Parto</span></div></td>
            <td>🟪 Obstetrícia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s2-5-2"> <span>Cefaleia</span></div></td>
            <td>🟥 Clínica</td>
        </tr>
        <tr>
            <td>✅ 10/08 (Sáb)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s2-6-1"> <span>Vacinação</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s2-6-2"> <span>Valvulopatias</span></div></td>
            <td>🟥 Clínica</td>
        </tr>
        <tr class="rest-row">
            <td>💤 11/08 (Dom)</td>
            <td><strong>DESCANSO</strong></td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
        </tr>
    </table>

    <!-- Semana 3 -->
    <div class="week-header" data-week="3">🗓️ Semana 3 – Ritmo Ideal</div>
    <table data-week="3">
        <tr>
            <th>📆 Data</th>
            <th>📚 Tema 1</th>
            <th>Área 1</th>
            <th>📚 Tema 2</th>
            <th>Área 2</th>
            <th>📚 Tema 3</th>
            <th>Área 3</th>
        </tr>
        <tr>
            <td>✅ 12/08 (Seg)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-1-1"> <span>Doenças Exantemáticas</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-1-2"> <span>Lúpus</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-1-3"> <span>Hérnias</span></div></td>
            <td>🟧 Cirurgia</td>
        </tr>
        <tr>
            <td>✅ 13/08 (Ter)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-2-1"> <span>Transtornos do Humor</span></div></td>
            <td>🧠 Psiquiatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-2-2"> <span>TORCH e Sífilis</span></div></td>
            <td>🟪 Gineco/Neo</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-2-3"> <span>Dislipidemia</span></div></td>
            <td>🟥 Clínica</td>
        </tr>
        <tr>
            <td>✅ 14/08 (Qua)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-3-1"> <span>Constipação na Infância</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-3-2"> <span>Endometriose</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-3-3"> <span>Úlcera Péptica e H. pylori</span></div></td>
            <td>🟥 Clínica</td>
        </tr>
        <tr>
            <td>✅ 15/08 (Qui)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-4-1"> <span>Distúrbios do Crescimento</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-4-2"> <span>DRGE</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-4-3"> <span>Trauma de Extremidades</span></div></td>
            <td>🟧 Cirurgia</td>
        </tr>
        <tr>
            <td>✅ 16/08 (Sex)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-5-1"> <span>Convulsão Febril e Epilepsia</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-5-2"> <span>Sangramento Uterino Anormal</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-5-3"> <span>Febre Reumática</span></div></td>
            <td>🟥 Clínica</td>
        </tr>
        <tr>
            <td>✅ 17/08 (Sáb)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-6-1"> <span>Puericultura</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-6-2"> <span>Monoartrite Aguda</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s3-6-3"> <span>Câncer de Mama</span></div></td>
            <td>🟪 Ginecologia</td>
        </tr>
        <tr class="rest-row">
            <td>💤 18/08 (Dom)</td>
            <td><strong>DESCANSO</strong></td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
        </tr>
    </table>

    <!-- Semana 4 -->
    <div class="week-header" data-week="4">🗓️ Semana 4 – Ritmo Intenso (Parte 1)</div>
    <table data-week="4">
        <tr>
            <th>📆 Data</th>
            <th>📚 Tema 1</th>
            <th>Área 1</th>
            <th>📚 Tema 2</th>
            <th>Área 2</th>
            <th>📚 Tema 3</th>
            <th>Área 3</th>
            <th>📚 Tema 4</th>
            <th>Área 4</th>
        </tr>
        <tr>
            <td>✅ 19/08 (Seg)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-1-1"> <span>AVC</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-1-2"> <span>Câncer de Pulmão</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-1-3"> <span>Cirurgia de Obesidade</span></div></td>
            <td>🟧 Cirurgia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-1-4"> <span>Sífilis/TORCH</span></div></td>
            <td>🟪 Gineco/Neo</td>
        </tr>
        <tr>
            <td>✅ 20/08 (Ter)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-2-1"> <span>Anemias Hipoproliferativas</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-2-2"> <span>Patologias Vulvares</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-2-3"> <span>Raiva e Tétano</span></div></td>
            <td>🟩 Preventiva</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-2-4"> <span>Desnutrição e Obesidade</span></div></td>
            <td>🟦 Pediatria</td>
        </tr>
        <tr>
            <td>✅ 21/08 (Qua)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-3-1"> <span>Hepatites Virais</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-3-2"> <span>Transtornos Alimentares</span></div></td>
            <td>🧠 Psiquiatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-3-3"> <span>Neoplasias Hematológicas</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-3-4"> <span>Cirurgia Vascular</span></div></td>
            <td>🟧 Cirurgia</td>
        </tr>
        <tr>
            <td>✅ 22/08 (Qui)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-4-1"> <span>Endometriose</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-4-2"> <span>TCE / TRM</span></div></td>
            <td>🟧 Cirurgia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-4-3"> <span>Artrite Reumatoide</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-4-4"> <span>Doenças Congênitas</span></div></td>
            <td>🟦 Pediatria</td>
        </tr>
        <tr>
            <td>✅ 23/08 (Sex)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-5-1"> <span>Síndrome Coronariana Aguda</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-5-2"> <span>Infecção Urinária Gestação</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-5-3"> <span>Gota e Artrite Infecciosa</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-5-4"> <span>IVAS</span></div></td>
            <td>🟦 Pediatria</td>
        </tr>
        <tr>
            <td>✅ 24/08 (Sáb)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-6-1"> <span>Doação de Órgãos</span></div></td>
            <td>🟩 Preventiva</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-6-2"> <span>Distúrbios da Hemostasia</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-6-3"> <span>Conteúdo Genital Patológico</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s4-6-4"> <span>Chikungunya, Zika e Febre Amarela</span></div></td>
            <td>🟩 Preventiva</td>
        </tr>
        <tr class="rest-row">
            <td>💤 25/08 (Dom)</td>
            <td><strong>DESCANSO</strong></td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
        </tr>
    </table>

    <!-- Semana 5 -->
    <div class="week-header" data-week="5">🗓️ Semana 5 – Ritmo Intenso (Parte 2)</div>
    <table data-week="5">
        <tr>
            <th>📆 Data</th>
            <th>📚 Tema 1</th>
            <th>Área 1</th>
            <th>📚 Tema 2</th>
            <th>Área 2</th>
            <th>📚 Tema 3</th>
            <th>Área 3</th>
            <th>📚 Tema 4</th>
            <th>Área 4</th>
        </tr>
        <tr>
            <td>✅ 26/08 (Seg)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-1-1"> <span>Prematuridade</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-1-2"> <span>DIP</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-1-3"> <span>Rotura Prematura Membranas</span></div></td>
            <td>🟪 Obstetrícia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-1-4"> <span>Vigilância Epidemiológica</span></div></td>
            <td>🟩 Preventiva</td>
        </tr>
        <tr>
            <td>✅ 27/08 (Ter)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-2-1"> <span>Anestesia</span></div></td>
            <td>🟧 Cirurgia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-2-2"> <span>Toxoplasmose na Gestação</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-2-3"> <span>Lombalgia</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-2-4"> <span>Câncer de Ovário</span></div></td>
            <td>🟪 Ginecologia</td>
        </tr>
        <tr>
            <td>✅ 28/08 (Qua)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-3-1"> <span>Trauma Abdominal</span></div></td>
            <td>🟧 Cirurgia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-3-2"> <span>Câncer de Tireoide</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-3-3"> <span>HTA Secundária</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-3-4"> <span>Leptospirose e Malária</span></div></td>
            <td>🟩 Preventiva</td>
        </tr>
        <tr>
            <td>✅ 29/08 (Qui)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-4-1"> <span>IRA</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-4-2"> <span>Disfunção Renal / Glomerular</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-4-3"> <span>Triagem Neonatal</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-4-4"> <span>Otorrinolaringologia</span></div></td>
            <td>🟧 Cirurgia</td>
        </tr>
        <tr>
            <td>✅ 30/08 (Sex)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-5-1"> <span>Infertilidade</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-5-2"> <span>Isoimunização RH</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-5-3"> <span>Meningite</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-5-4"> <span>AVC</span></div></td>
            <td>🟥 Clínica</td>
        </tr>
        <tr>
            <td>✅ 31/08 (Sáb)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-6-1"> <span>Fibromialgia</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-6-2"> <span>Constipação Infantil</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-6-3"> <span>Doença Inflamatória Intestinal</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s5-6-4"> <span>Trauma Torácico</span></div></td>
            <td>🟧 Cirurgia</td>
        </tr>
        <tr class="rest-row">
            <td>💤 01/09 (Dom)</td>
            <td><strong>DESCANSO</strong></td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
        </tr>
    </table>

    <!-- Semana 6 -->
    <div class="week-header" data-week="6">🗓️ Semana 6 – Fechamento de Conteúdo</div>
    <table data-week="6">
        <tr>
            <th>📆 Data</th>
            <th>📚 Tema 1</th>
            <th>Área 1</th>
            <th>📚 Tema 2</th>
            <th>Área 2</th>
            <th>📚 Tema 3</th>
            <th>Área 3</th>
            <th>📚 Tema 4</th>
            <th>Área 4</th>
        </tr>
        <tr>
            <td>✅ 02/09 (Seg)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-1-1"> <span>AVC Hemorrágico</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-1-2"> <span>Psicose e Transtorno de Humor</span></div></td>
            <td>🧠 Psiquiatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-1-3"> <span>Urologia</span></div></td>
            <td>🟧 Cirurgia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-1-4"> <span>Câncer de Esôfago</span></div></td>
            <td>🟧 Cirurgia</td>
        </tr>
        <tr>
            <td>✅ 03/09 (Ter)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-2-1"> <span>Asma</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-2-2"> <span>Câncer de Pele</span></div></td>
            <td>🟧 Cirurgia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-2-3"> <span>Distúrbios do Perioperatório</span></div></td>
            <td>🟧 Cirurgia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-2-4"> <span>Doença de Parkinson</span></div></td>
            <td>🟥 Clínica</td>
        </tr>
        <tr>
            <td>✅ 04/09 (Qua)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-3-1"> <span>Crise de Asma</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-3-2"> <span>Diabetes Gestacional</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-3-3"> <span>Saúde da Família</span></div></td>
            <td>🟩 Preventiva</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-3-4"> <span>Maus Tratos</span></div></td>
            <td>🟦 Pediatria</td>
        </tr>
        <tr>
            <td>✅ 05/09 (Qui)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-4-1"> <span>Reanimação Neonatal</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-4-2"> <span>Abordagem Cirúrgica Obstrutiva</span></div></td>
            <td>🟧 Cirurgia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-4-3"> <span>Trauma Cervical e Pélvico</span></div></td>
            <td>🟧 Cirurgia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-4-4"> <span>Relações Uterofetais</span></div></td>
            <td>🟪 Obstetrícia</td>
        </tr>
        <tr>
            <td>✅ 06/09 (Sex)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-5-1"> <span>PBLS e PALS</span></div></td>
            <td>🟩 Preventiva</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-5-2"> <span>Diabetes - Complicações</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-5-3"> <span>ITU na infância</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-5-4"> <span>Vitalidade Fetal</span></div></td>
            <td>🟪 Obstetrícia</td>
        </tr>
        <tr>
            <td>✅ 07/09 (Sáb)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-6-1"> <span>Diabetes - Diagnóstico</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-6-2"> <span>Diabetes - Tratamento</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-6-3"> <span>Síndrome dos Ovários Policísticos</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s6-6-4"> <span>Ética Médica Revisão</span></div></td>
            <td>🟩 Preventiva</td>
        </tr>
        <tr class="rest-row">
            <td>💤 08/09 (Dom)</td>
            <td><strong>DESCANSO</strong></td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
        </tr>
    </table>

    <!-- Semana 7 -->
    <div class="week-header" data-week="7">🗓️ Semana 7 – Revisão Final (Parte 1)</div>
    <table data-week="7">
        <tr>
            <th>📆 Data</th>
            <th>📚 Tema 1</th>
            <th>Área 1</th>
            <th>📚 Tema 2</th>
            <th>Área 2</th>
        </tr>
        <tr>
            <td>✅ 09/09 (Seg)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s7-1-1"> <span>Sepse</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s7-1-2"> <span>Trauma - Atendimento Inicial</span></div></td>
            <td>🟧 Cirurgia</td>
        </tr>
        <tr>
            <td>✅ 10/09 (Ter)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s7-2-1"> <span>Síndromes Hipertensivas Gestação</span></div></td>
            <td>🟪 Obstetrícia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s7-2-2"> <span>Diabetes Gestacional</span></div></td>
            <td>🟪 Obstetrícia</td>
        </tr>
        <tr>
            <td>✅ 11/09 (Qua)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s7-3-1"> <span>Abdome Agudo - Apendicite</span></div></td>
            <td>🟧 Cirurgia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s7-3-2"> <span>Abdome Agudo Obstrutivo</span></div></td>
            <td>🟧 Cirurgia</td>
        </tr>
        <tr>
            <td>✅ 12/09 (Qui)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s7-4-1"> <span>Pneumonia Adquirida na Comunidade</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s7-4-2"> <span>Pneumonia na Infância</span></div></td>
            <td>🟦 Pediatria</td>
        </tr>
        <tr>
            <td>✅ 13/09 (Sex)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s7-5-1"> <span>Hemorragia Pós-Parto</span></div></td>
            <td>🟪 Obstetrícia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s7-5-2"> <span>Hemorragias da 1ª Metade Gestação</span></div></td>
            <td>🟪 Obstetrícia</td>
        </tr>
        <tr>
            <td>✅ 14/09 (Sáb)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s7-6-1"> <span>Meningite</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s7-6-2"> <span>Reanimação Neonatal</span></div></td>
            <td>🟦 Pediatria</td>
        </tr>
        <tr class="rest-row">
            <td>💤 15/09 (Dom)</td>
            <td><strong>DESCANSO</strong></td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
        </tr>
    </table>

    <!-- Semana 8 -->
    <div class="week-header" data-week="8">🗓️ Semana 8 – Revisão Final (Parte 2)</div>
    <table data-week="8">
        <tr>
            <th>📆 Data</th>
            <th>📚 Tema 1</th>
            <th>Área 1</th>
            <th>📚 Tema 2</th>
            <th>Área 2</th>
        </tr>
        <tr>
            <td>✅ 16/09 (Seg)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s8-1-1"> <span>Avaliação do RN / Desconforto Respiratório</span></div></td>
            <td>🟦 Pediatria</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s8-1-2"> <span>Icterícia Neonatal</span></div></td>
            <td>🟦 Pediatria</td>
        </tr>
        <tr>
            <td>✅ 17/09 (Ter)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s8-2-1"> <span>Câncer de Colo de Útero e HPV</span></div></td>
            <td>🟪 Ginecologia</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s8-2-2"> <span>Planejamento Familiar</span></div></td>
            <td>🟪 Ginecologia</td>
        </tr>
        <tr>
            <td>✅ 18/09 (Qua)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s8-3-1"> <span>Tuberculose</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s8-3-2"> <span>Hanseníase</span></div></td>
            <td>🟥 Clínica</td>
        </tr>
        <tr>
            <td>✅ 19/09 (Qui)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s8-4-1"> <span>Atenção Básica</span></div></td>
            <td>🟩 Preventiva</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s8-4-2"> <span>Testes Diagnósticos/Epidemiologia</span></div></td>
            <td>🟩 Preventiva</td>
        </tr>
        <tr>
            <td>✅ 20/09 (Sex)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s8-5-1"> <span>Valvulopatias</span></div></td>
            <td>🟥 Clínica</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s8-5-2"> <span>Insuficiência Cardíaca</span></div></td>
            <td>🟥 Clínica</td>
        </tr>
        <tr>
            <td>✅ 21/09 (Sáb)</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s8-6-1"> <span>Violência Sexual</span></div></td>
            <td>🟩 Preventiva</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="s8-6-2"> <span>Maus Tratos</span></div></td>
            <td>🟦 Pediatria</td>
        </tr>
        <tr class="rest-row">
            <td>💤 22/09 (Dom)</td>
            <td><strong>DESCANSO</strong></td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
        </tr>
    </table>

    <!-- Semana Extra -->
    <div class="week-header" data-week="extra">🟨 Semana Extra – Revisão Flash (Última Semana!)</div>
    <table class="extra-week" data-week="extra">
        <tr>
            <th>Semana</th>
            <th>Foco Diário</th>
        </tr>
        <tr>
            <td>✅ 23-28/09</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="se-1"> <span>Revisar: Parto, Sepse, Abdome Agudo, Síndromes Obstétricas, PALS</span></div></td>
        </tr>
        <tr>
            <td>✅ 30-05/10</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="se-2"> <span>Revisar: Testes rápidos, infecções, trauma, ética, avaliação do RN</span></div></td>
        </tr>
        <tr>
            <td>✅ 07-11/10</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="se-3"> <span>Revisar: Questões de simulado, checklist 2ª fase, prática de anamnese</span></div></td>
        </tr>
        <tr>
            <td>✅ 14-18/10</td>
            <td><div class="topic"><input type="checkbox" class="topic-checkbox" data-id="se-4"> <span>Repassar anotações, dormir bem, REVISÃO LEVE, autocuidado 🧠❤️</span></div></td>
        </tr>
    </table>

    <script>
        // Countdown Timer to October 19, 2025
        function startCountdown() {
            const targetDate = new Date('2025-10-19T23:59:59').getTime();
            const countdownElement = document.getElementById('countdown');
            
            function updateCountdown() {
                const now = new Date().getTime();
                const distance = targetDate - now;
                
                if (distance < 0) {
                    countdownElement.textContent = 'Prazo finalizado!';
                    clearInterval(countdownInterval);
                    return;
                }
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
            
            updateCountdown();
            const countdownInterval = setInterval(updateCountdown, 1000);
        }

        // Motivational Quotes
        const quotes = [
            "Cada página estudada é um passo mais perto do seu sonho de médico! 💉",
            "Você é mais forte do que qualquer desafio do Revalida! 🚀",
            "Foco e determinação: você vai conquistar o Enamed! 🩺",
            "A jornada é longa, mas sua dedicação é imbatível! 🌟",
            "Estude com paixão, você está moldando o futuro da saúde! ❤️",
            "Cada tópico dominado é uma vitória rumo à aprovação! 🏆",
            "Acredite no seu potencial, o Revalida é só um degrau! 💪",
            "Seu esforço hoje é a chave para salvar vidas amanhã! 🩻",
            "Persistência é o segredo dos grandes médicos! Siga em frente! 🌈",
            "Você está construindo sua história de sucesso, continue! 📚",
            "Não desista, cada estudo te aproxima do jaleco dos seus sonhos! 👩‍⚕️",
            "A medicina precisa de você, estude com garra! 💥",
            "Um dia de cada vez, e o Revalida será seu! ⏳",
            "Você é capaz de superar qualquer obstáculo! Confie! 🧠",
            "Cada conceito aprendido é um paciente que você ajudará! 🩺",
            "O caminho é árduo, mas sua determinação é maior! 💪",
            "Estude com propósito, você está destinado a brilhar! ✨",
            "A aprovação está ao seu alcance, continue firme! 🥼",
            "Seu futuro como médico está sendo construído agora! 🏥",
            "Cada hora de estudo é um investimento na sua carreira! 📖",
            "Você é a prova de que dedicação transforma sonhos em realidade! 🌟",
            "O Revalida é só um teste, mas você é um médico de verdade! 💉",
            "Siga estudando, o topo é logo ali! 🏔️",
            "Sua força de vontade é sua maior aliada! Continue! 🚀",
            "Cada tópico concluído é um passo rumo à vitória! 🏅",
            "Você está no caminho certo, mantenha o ritmo! ⏰",
            "O conhecimento que você adquire hoje salvará vidas amanhã! ❤️",
            "Não pare agora, o Revalida está esperando por você! 🩺",
            "Sua dedicação é inspiração para todos! Siga brilhando! 🌟",
            "Você é mais forte do que qualquer questão do Enamed! 💪",
            "Estude com amor, a medicina é sua vocação! 🩻",
            "Cada página virada é um passo mais perto da aprovação! 📚",
            "Você é imparável, o Revalida é só um desafio! 🔥",
            "Acredite: seu esforço vai valer a pena! 🏆",
            "O futuro da saúde conta com você, continue firme! 🩺",
            "Cada dia de estudo é uma conquista para o seu futuro! 🌈",
            "Você está transformando sonhos em realidade, não desista! ✨",
            "O Revalida é grande, mas sua determinação é maior! 💥",
            "Estude com foco, o jaleco está te esperando! 👩‍⚕️",
            "Cada tópico é uma batalha vencida na guerra pelo Revalida! 🏅",
            "Você é capaz de conquistar qualquer meta! Siga em frente! 🚀",
            "A medicina é sua paixão, e o Revalida é só um passo! ❤️",
            "Seu esforço hoje é o orgulho de amanhã! 🌟",
            "Você está escrevendo sua história de sucesso, continue! 📖",
            "O Revalida é um desafio, mas você é a solução! 💪",
            "Cada hora de estudo é um tijolo na sua carreira médica! 🏥",
            "Você é mais forte do que qualquer obstáculo! Persista! 🧠",
            "O caminho é longo, mas a vitória é certa! 🏆",
            "Estude com garra, o futuro é seu! 🌈",
            "Você está cada vez mais perto do seu sonho! Siga firme! ✨",
            "O Revalida é só uma etapa, você é o destino! 🚀",
            "Sua dedicação é o que faz a diferença! Continue! 💉",
            "Cada tópico dominado é um passo rumo à aprovação! 🩺",
            "Você é um futuro médico brilhante, não pare agora! 🌟",
            "O esforço de hoje é o sucesso de amanhã! 📚",
            "Você está construindo um legado na medicina! 🏥",
            "O Revalida é grande, mas sua força é maior! 💪",
            "Estude com paixão, você nasceu para isso! ❤️",
            "Cada página estudada é uma vitória rumo ao jaleco! 👩‍⚕️",
            "Você é a prova de que sonhos se tornam realidade! ✨",
            "Continue firme, o Revalida está ao seu alcance! 🏅",
            "Sua determinação é o que te levará ao topo! 🚀",
            "Estude com propósito, a medicina precisa de você! 🩺",
            "Cada dia de estudo é um passo mais perto da aprovação! 📖",
            "Você é mais forte do que qualquer desafio! Siga em frente! 💥",
            "O Revalida é só uma etapa, seu futuro é brilhante! 🌟",
            "Sua dedicação é sua maior arma! Continue! 🧠",
            "Você está moldando o futuro da saúde, estude com orgulho! 🩻",
            "Cada tópico é uma conquista, você está no caminho certo! 🏆",
            "O Revalida é um teste, mas você é a resposta! 💪",
            "Estude com foco, o jaleco está cada vez mais perto! 👩‍⚕️",
            "Você é capaz de superar qualquer barreira! Persista! ✨",
            "O conhecimento que você adquire hoje salvará vidas! ❤️",
            "Cada hora de estudo é um passo rumo à vitória! 🏅",
            "Você está construindo sua carreira com cada página! 📚",
            "O Revalida é só o começo, seu futuro é brilhante! 🌈",
            "Sua determinação é inspiradora, continue firme! 🚀",
            "Estude com amor, a medicina é sua vocação! 🩺",
            "Você está cada vez mais perto do seu sonho! Siga em frente! 🌟",
            "O esforço de hoje é a aprovação de amanhã! 🏆",
            "Você é um futuro médico incrível, não desista! 💉",
            "Cada tópico concluído é um passo rumo ao sucesso! 📖",
            "O Revalida é um desafio, mas você é imbatível! 💪",
            "Estude com garra, o futuro da saúde depende de você! 🩻",
            "Você está escrevendo sua história de vitória! Continue! ✨",
            "Cada dia de estudo é uma conquista para o seu futuro! 🏥",
            "O Revalida é grande, mas sua vontade é maior! 🚀",
            "Você é a prova de que dedicação leva à aprovação! 🌟",
            "Estude com paixão, você nasceu para ser médico! ❤️",
            "Cada página virada é um passo mais perto do jaleco! 👩‍⚕️",
            "Você é imparável, o Revalida é só um degrau! 🏅",
            "Sua determinação é o que te levará ao topo! 💪",
            "Estude com propósito, a medicina é seu destino! 🩺",
            "Você está construindo um futuro brilhante, continue! 🌈",
            "O Revalida é só uma etapa, sua história é muito maior! ✨",
            "Cada tópico dominado é uma vitória para o seu futuro! 🏆",
            "Você é mais forte do que qualquer questão do Enamed! 💥",
            "Estude com foco, o jaleco está te esperando! 👩‍⚕️",
            "Você está transformando sonhos em realidade! Persista! 🌟"
        ];

        // Function to update progress bar
        function updateProgress() {
            const checkboxes = document.querySelectorAll('.topic-checkbox');
            const totalTopics = checkboxes.length;
            const completedTopics = Array.from(checkboxes).filter(cb => cb.checked).length;
            const percentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
            document.getElementById('progress-percentage').textContent = `${Math.round(percentage)}%`;
            document.getElementById('progress-fill').style.width = `${percentage}%`;
        }

        // Function to check week completion
        function checkWeekCompletion(week) {
            const table = document.querySelector(`table[data-week="${week}"]`);
            const checkboxes = table.querySelectorAll('.topic-checkbox');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            const weekHeader = document.querySelector(`.week-header[data-week="${week}"]`);
            const isCompleted = localStorage.getItem(`week-${week}-completed`) === 'true';

            if (allChecked && !isCompleted) {
                // Show celebration message
                const celebrationMessage = document.getElementById('celebration-message');
                document.body.classList.add('blur');
                celebrationMessage.style.display = 'block';
                setTimeout(() => {
                    celebrationMessage.style.display = 'none';
                    document.body.classList.remove('blur');
                }, 1000);
                // Mark week as completed
                weekHeader.classList.add('week-completed');
                localStorage.setItem(`week-${week}-completed`, 'true');
            } else if (allChecked) {
                weekHeader.classList.add('week-completed');
            } else {
                weekHeader.classList.remove('week-completed');
                localStorage.setItem(`week-${week}-completed`, 'false');
            }
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            // Start countdown
            startCountdown();

            // Set random motivational quote
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            document.getElementById('motivational-quote').textContent = randomQuote;

            // Load saved checkbox states and update UI
            const checkboxes = document.querySelectorAll('.topic-checkbox');
            checkboxes.forEach(checkbox => {
                const id = checkbox.getAttribute('data-id');
                const isChecked = localStorage.getItem(`topic-${id}`) === 'true';
                checkbox.checked = isChecked;
                if (isChecked) {
                    checkbox.nextElementSibling.classList.add('completed');
                }
            });

            // Check completion for all weeks
            ['1', '2', '3', '4', '5', '6', '7', '8', 'extra'].forEach(week => {
                checkWeekCompletion(week);
            });

            // Update progress bar
            updateProgress();
        });

        // Handle checkbox changes
        document.addEventListener('change', (event) => {
            if (event.target.classList.contains('topic-checkbox')) {
                const checkbox = event.target;
                const id = checkbox.getAttribute('data-id');
                localStorage.setItem(`topic-${id}`, checkbox.checked);
                if (checkbox.checked) {
                    checkbox.nextElementSibling.classList.add('completed');
                } else {
                    checkbox.nextElementSibling.classList.remove('completed');
                }
                updateProgress();
                const week = checkbox.closest('table').getAttribute('data-week');
                checkWeekCompletion(week);
            }
        });
    </script>

<script>
function resetProgresso() {
    if (confirm('Tem certeza que deseja apagar todo o progresso?')) {
        localStorage.clear();
        location.reload();
    }
}
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
    document.getElementById('darkModeToggle').textContent = mode === 'dark' ? '☀️ Ativar Modo Claro' : '🌙 Ativar Modo Escuro';
});
document.getElementById('filtroArea').addEventListener('change', function () {
    const valor = this.value;
    document.querySelectorAll('table tr').forEach(row => {
        if (!row.querySelector('td')) return;
        const cells = row.querySelectorAll('td');
        const areaText = Array.from(cells).map(c => c.textContent).find(t => t.includes(valor));
        if (valor === 'todas' || areaText) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').textContent = '☀️ Ativar Modo Claro';
    }
    const checkboxes = document.querySelectorAll('.topic-checkbox');
    checkboxes.forEach(checkbox => {
        const id = checkbox.getAttribute('data-id');
        const isChecked = localStorage.getItem(`topic-${id}`) === 'true';
        checkbox.checked = isChecked;
        if (isChecked) checkbox.nextElementSibling.classList.add('completed');
        const lastSeen = localStorage.getItem(`last-seen-${id}`);
        if (lastSeen) {
            const daysAgo = Math.floor((Date.now() - Number(lastSeen)) / (1000 * 60 * 60 * 24));
            const emoji = daysAgo <= 7 ? '🔥' : '🧊';
            checkbox.nextElementSibling.innerHTML += ` <span style="margin-left:5px">${emoji}</span>`;
        }
    });
});
document.addEventListener('change', (event) => {
    if (event.target.classList.contains('topic-checkbox')) {
        const checkbox = event.target;
        const id = checkbox.getAttribute('data-id');
        localStorage.setItem(`topic-${id}`, checkbox.checked);
        localStorage.setItem(`last-seen-${id}`, Date.now());
        if (checkbox.checked) {
            checkbox.nextElementSibling.classList.add('completed');
        } else {
            checkbox.nextElementSibling.classList.remove('completed');
        }
    }
});
</script>
</body>
</html>

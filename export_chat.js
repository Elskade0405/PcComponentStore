const fs = require('fs');

const logPath = 'C:\\\\Users\\\\NSH\\\\.gemini\\\\antigravity\\\\brain\\\\67ce6628-babd-4585-9bc4-bceab0c4c2a0\\\\.system_generated\\\\logs\\\\overview.txt';
const outPath = 'f:\\\\workspace\\\\PcComponentStore\\\\Lich_Su_Chat_Hien_Tai.md';

try {
    const lines = fs.readFileSync(logPath, 'utf8').split('\\n').filter(l => l.trim() !== '');
    let mdContent = '# Lịch Sử Chat Của Dự Án\\n\\n';

    for (const line of lines) {
        try {
            const data = JSON.parse(line);
            if (data.source === 'USER_EXPLICIT' && data.type === 'USER_INPUT') {
                let content = data.content || '';
                let requestText = content;
                const startIdx = content.indexOf('<USER_REQUEST>');
                const endIdx = content.indexOf('</USER_REQUEST>');
                if (startIdx !== -1 && endIdx !== -1) {
                    requestText = content.substring(startIdx + 14, endIdx).trim();
                }
                mdContent += `### 🧑 User\\n\\n${requestText}\\n\\n---\\n\\n`;
            } else if (data.source === 'MODEL' && data.type === 'PLANNER_RESPONSE') {
                if (data.content) {
                    mdContent += `### 🤖 Assistant\\n\\n${data.content}\\n\\n---\\n\\n`;
                } else if (data.tool_calls) {
                    const toolNames = data.tool_calls.map(t => t.name).join(', ');
                    mdContent += `*(Hệ thống sử dụng các công cụ: ${toolNames})*\\n\\n`;
                }
            }
        } catch(e) {
            // ignore
        }
    }

    fs.writeFileSync(outPath, mdContent);
    console.log('Exported successfully to ' + outPath);
} catch (e) {
    console.error(e);
}

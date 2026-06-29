import React, { useMemo } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const RealtimeAiAssistant = ({ selectedParts }) => {
    const analysis = useMemo(() => {
        let warnings = [];
        let success = null;
        let hints = [];

        const getAttr = (slotId, attrName) => {
            const item = selectedParts[slotId];
            if (!item || !item.product || !item.product.attributes) return null;
            try {
                const attrs = JSON.parse(item.product.attributes);
                return attrs[attrName];
            } catch (e) {
                return null;
            }
        };

        const hasCpu = !!selectedParts['cpu'];
        const hasMain = !!selectedParts['mainboard'];
        const hasRam = !!selectedParts['ram'];

        const cpuSocket = getAttr('cpu', 'socket');
        const mainSocket = getAttr('mainboard', 'socket');
        
        const mainChipset = getAttr('mainboard', 'chipset') || '';
        const ramType = getAttr('ram', 'type') || getAttr('ram', 'chuẩn ram'); 

        if (hasCpu && hasMain) {
            if (cpuSocket && mainSocket && String(cpuSocket).trim().toLowerCase() !== String(mainSocket).trim().toLowerCase()) {
                warnings.push(`Cảnh báo: CPU (Socket ${cpuSocket}) KHÔNG tương thích với Mainboard (Socket ${mainSocket})!`);
            }
        } else if (hasCpu && !hasMain) {
            hints.push("Bạn đã có CPU, hãy chọn thêm một Mainboard có cùng Socket nhé.");
        } else if (!hasCpu && hasMain) {
            hints.push("Bạn đã có Mainboard, hãy chọn CPU có Socket phù hợp.");
        }

        if (hasMain && hasRam) {
            const mainName = selectedParts['mainboard'].product.name.toUpperCase();
            const isMainDDR5 = mainName.includes('DDR5') || mainChipset.includes('X670') || mainChipset.includes('B650') || mainChipset.includes('Z790') && !mainName.includes('DDR4');
            const isMainDDR4 = mainName.includes('DDR4') || mainChipset.includes('H610') || mainChipset.includes('B660');
            
            if (ramType) {
                if (ramType.includes('DDR5') && isMainDDR4) {
                    warnings.push(`Cảnh báo: RAM DDR5 không thể cắm vào Mainboard chỉ hỗ trợ DDR4.`);
                }
                if (ramType.includes('DDR4') && isMainDDR5) {
                    warnings.push(`Cảnh báo: RAM DDR4 không thể cắm vào Mainboard này (yêu cầu DDR5).`);
                }
            }
        }

        const hasVga = !!selectedParts['vga'];
        const hasPsu = !!selectedParts['psu'];
        const hasSsd = !!selectedParts['ssd'];

        if (hasCpu && hasMain) {
            if (!hasRam) hints.push("Đừng quên chọn thêm RAM để hệ thống có thể hoạt động nhé.");
            if (!hasPsu && hasVga) hints.push("Bạn đã chọn Card màn hình rời, hãy chắc chắn chọn một bộ Nguồn (PSU) có công suất đủ lớn.");
            if (hasRam && !hasSsd) hints.push("Cấu hình vẫn thiếu ổ cứng (SSD) để cài hệ điều hành.");
        }

        if (hasCpu && hasVga) {
            const cpuName = selectedParts['cpu'].product.name.toUpperCase();
            const vgaName = selectedParts['vga'].product.name.toUpperCase();
            if ((cpuName.includes('I3') || cpuName.includes('RYZEN 3')) && (vgaName.includes('RTX 4080') || vgaName.includes('RTX 4090'))) {
                warnings.push("Lưu ý: CPU dòng i3/Ryzen 3 có thể gây nghẽn cổ chai (bottleneck) nghiêm trọng cho Card đồ họa cao cấp như RTX 4080/4090.");
            }
        }

        const estimateWattage = (name, type) => {
            if (!name) return 0;
            const upName = name.toUpperCase();
            if (type === 'cpu') {
                if (upName.includes('I9') || upName.includes('RYZEN 9')) return 150;
                if (upName.includes('I7') || upName.includes('RYZEN 7')) return 105;
                if (upName.includes('I5') || upName.includes('RYZEN 5')) return 65;
                if (upName.includes('I3') || upName.includes('RYZEN 3')) return 60;
                return 65;
            }
            if (type === 'vga') {
                if (upName.includes('4090')) return 450;
                if (upName.includes('4080')) return 320;
                if (upName.includes('3090')) return 350;
                if (upName.includes('4070') || upName.includes('3080')) return 285;
                if (upName.includes('7900')) return 300;
                if (upName.includes('3070') || upName.includes('7800') || upName.includes('6700')) return 230;
                if (upName.includes('4060') || upName.includes('3060') || upName.includes('7600') || upName.includes('6600')) return 160;
                if (upName.includes('3050')) return 130;
                return 150;
            }
            return 0;
        };

        if (hasCpu && hasVga && hasPsu) {
            const cpuW = estimateWattage(selectedParts['cpu'].product.name, 'cpu');
            const vgaW = estimateWattage(selectedParts['vga'].product.name, 'vga');
            const baseW = 100; 
            const totalEstimated = cpuW + vgaW + baseW;
            const recommendedPsu = totalEstimated * 1.3; 

            const psuWattageAttr = getAttr('psu', 'wattage') || '0W';
            const psuW = parseInt(psuWattageAttr.replace(/\D/g, '')) || 0;

            if (psuW > 0) {
                if (psuW < recommendedPsu * 0.85) {
                    warnings.push(`Cảnh báo: Nguồn ${psuW}W có thể KHÔNG ĐỦ cho cấu hình này (Ước tính cần tối thiểu ~${Math.round(recommendedPsu)}W để an toàn). Hãy nâng cấp nguồn!`);
                } else if (psuW >= recommendedPsu * 0.85 && psuW < recommendedPsu) {
                    hints.push(`Nguồn ${psuW}W vừa đủ xài, nhưng để nâng cấp về sau hoặc hoạt động mát mẻ nhất, bạn nên cân nhắc nguồn ~${Math.round(recommendedPsu)}W.`);
                } else if (psuW > recommendedPsu * 1.6) {
                    hints.push(`Nguồn ${psuW}W khá dư thừa (Overkill) cho cấu hình này (Chỉ cần ~${Math.round(recommendedPsu)}W). Tuy nhiên dư dả nguồn cũng rất tốt cho tương lai!`);
                } else {
                    hints.push(`Tuyệt vời! Nguồn ${psuW}W rất phù hợp và an toàn cho cấu hình của bạn.`);
                }
            }
        }

        const partsCount = Object.keys(selectedParts).length;

        if (partsCount === 0) {
            hints.push("Chào bạn! Hãy bắt đầu bằng cách chọn CPU hoặc Mainboard nhé.");
        } else if (warnings.length === 0 && partsCount >= 5) {
            success = "Cấu hình của bạn đang rất hoàn hảo và tương thích tốt!";
        }

        return { warnings, hints, success };
    }, [selectedParts]);

    if (analysis.warnings.length === 0 && analysis.hints.length === 0 && !analysis.success) {
        return null; 
    }

    return (
        <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden', marginTop: '1rem' }}>
            <div style={{ backgroundColor: '#e0e7ff', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #c7d2fe' }}>
                <Sparkles size={18} color="#4f46e5" />
                <span style={{ fontWeight: 700, color: '#3730a3', fontSize: '0.95rem' }}>AI Trợ lý ảo (Real-time)</span>
            </div>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                
                {analysis.warnings.map((warn, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#b91c1c', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '6px', border: '1px solid #fecaca', fontSize: '0.85rem', fontWeight: 600 }}>
                        <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{warn}</span>
                    </div>
                ))}

                {analysis.warnings.length === 0 && analysis.success && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', backgroundColor: '#f0fdf4', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '0.85rem', fontWeight: 600 }}>
                        <CheckCircle2 size={18} />
                        <span>{analysis.success}</span>
                    </div>
                )}

                {analysis.hints.map((hint, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#0369a1', backgroundColor: '#e0f2fe', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bae6fd', fontSize: '0.85rem' }}>
                        <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{hint}</span>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default RealtimeAiAssistant;

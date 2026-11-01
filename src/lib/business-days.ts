/**
 * Cálculo de dias úteis. Não conta sábados, domingos nem feriados cadastrados.
 * Todas as funções são puras e independentes de React.
 */

export const PRAZO_DIAS_UTEIS = 3;
const DIA_MS = 24 * 60 * 60 * 1000;

export function chaveData(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dia}`;
}

export function ehDiaUtil(d: Date, feriados: string[]): boolean {
  const dow = d.getDay();
  if (dow === 0 || dow === 6) return false;
  return !feriados.includes(chaveData(d));
}

/** Soma N dias úteis a partir da data informada. O prazo termina às 23h59 do último dia. */
export function adicionarDiasUteis(inicio: Date, dias: number, feriados: string[]): Date {
  const d = new Date(inicio);
  let contados = 0;
  while (contados < dias) {
    d.setDate(d.getDate() + 1);
    if (ehDiaUtil(d, feriados)) contados++;
  }
  d.setHours(23, 59, 59, 0);
  return d;
}

export function calcularPrazoEntrega(publicadoEm: Date, feriados: string[], dias = PRAZO_DIAS_UTEIS): Date {
  return adicionarDiasUteis(publicadoEm, dias, feriados);
}

function inicioDoDia(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Dias úteis que ainda restam depois de hoje, até o dia limite (inclusive). */
export function diasUteisRestantes(agora: Date, limite: Date, feriados: string[]): number {
  const fim = inicioDoDia(limite);
  const d = inicioDoDia(agora);
  let n = 0;
  while (d < fim) {
    d.setDate(d.getDate() + 1);
    if (ehDiaUtil(d, feriados)) n++;
  }
  return n;
}

export interface DescricaoPrazo {
  texto: string;
  vencido: boolean;
  urgente: boolean;
}

export function descreverPrazo(agora: Date, limite: Date, feriados: string[]): DescricaoPrazo {
  if (agora.getTime() > limite.getTime()) {
    const dias = Math.max(1, Math.floor((inicioDoDia(agora).getTime() - inicioDoDia(limite).getTime()) / DIA_MS));
    return { texto: dias <= 1 ? 'Prazo vencido' : `Vencido há ${dias} dias`, vencido: true, urgente: true };
  }
  if (chaveData(agora) === chaveData(limite)) {
    return { texto: 'Vence hoje às 23h59', vencido: false, urgente: true };
  }
  const n = diasUteisRestantes(agora, limite, feriados);
  return {
    texto: n === 1 ? 'Falta 1 dia útil' : `Faltam ${n} dias úteis`,
    vencido: false,
    urgente: n <= 1,
  };
}

'use client';

import { useState, type FormEvent } from 'react';
import { CalendarX2, Plus, RotateCcw, Trash2 } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { formatarData } from '@/lib/format';
import { adicionarFeriado, removerFeriado } from '@/services/biblioteca.service';

export default function SecaoConfiguracoes() {
  const { feriados, atualizar, restaurar } = useData();
  const { recarregar } = useAuth();
  const toast = useToast();
  const [data, setData] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [confirmar, setConfirmar] = useState(false);

  function adicionar(e: FormEvent) {
    e.preventDefault();
    if (!data || nome.trim().length < 3) return setErro('Informe a data e o nome do feriado (mínimo de 3 letras).');
    const r = adicionarFeriado(data, nome);
    if (!r.ok) return setErro(r.erro);
    atualizar(); setData(''); setNome(''); setErro(''); toast('sucesso', 'Feriado cadastrado.');
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Configurações</h1>
      <p className="mt-1 text-suave">Feriados fictícios usados no cálculo dos 3 dias úteis de entrega.</p>
      <div className="mt-5"><Alert tipo="info">As alterações valem para novos comunicados. Prazos já calculados não são recalculados.</Alert></div>

      <section className="card mt-6 p-5" aria-labelledby="ft">
        <h2 id="ft" className="text-lg font-bold">Adicionar feriado</h2>
        <form onSubmit={adicionar} className="mt-4 grid gap-4 sm:grid-cols-[200px_1fr_auto] sm:items-start" noValidate>
          <Input type="date" label="Data" value={data} onChange={(e) => setData(e.target.value)} />
          <Input label="Nome" placeholder="Ex.: Recesso acadêmico" value={nome} onChange={(e) => setNome(e.target.value)} />
          <div className="sm:pt-[26px]"><Button type="submit" icone={<Plus className="h-4 w-4" />}>Adicionar</Button></div>
        </form>
        {erro && <p role="alert" className="mt-2 text-sm font-medium text-red-600">{erro}</p>}
      </section>

      <div className="mt-6">
        {feriados.length === 0 ? <EmptyState icone={CalendarX2} titulo="Nenhum feriado cadastrado" texto="Sem feriados, só sábados e domingos ficam de fora da contagem." /> : (
          <ul className="card divide-y divide-slate-100">
            {feriados.map((f) => (
              <li key={f.data} className="flex items-center justify-between gap-3 p-4">
                <div><p className="font-semibold text-navy">{f.nome}</p><p className="text-sm text-suave">{formatarData(f.data)}</p></div>
                <Button variante="fantasma" tamanho="sm" icone={<Trash2 className="h-4 w-4" />} aria-label={`Remover feriado ${f.nome}`} onClick={() => { removerFeriado(f.data); atualizar(); toast('info', 'Feriado removido.'); }}>Remover</Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <section className="card mt-8 p-5">
        <h2 className="text-lg font-bold">Dados de demonstração</h2>
        <p className="mt-1 text-sm text-suave">Apaga cadastros e comunicados criados e restaura os dados iniciais. Útil para repetir os testes.</p>
        <div className="mt-4"><Button variante="perigo" icone={<RotateCcw className="h-4 w-4" />} onClick={() => setConfirmar(true)}>Restaurar dados de demonstração</Button></div>
      </section>
      <Modal aberto={confirmar} onClose={() => setConfirmar(false)} titulo="Restaurar dados?" descricao="Esta ação não pode ser desfeita."
        rodape={<><Button variante="secundario" onClick={() => setConfirmar(false)}>Cancelar</Button><Button variante="perigo" onClick={() => { restaurar(); recarregar(); setConfirmar(false); toast('sucesso', 'Dados de demonstração restaurados.'); }}>Restaurar</Button></>}>
        <p className="text-sm">Todos os comunicados, notificações, solicitações e usuários cadastrados voltarão ao estado inicial.</p>
      </Modal>
    </div>
  );
}

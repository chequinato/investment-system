
import { useEffect, useState } from 'react';
import { getToken, removeToken } from '../auth';

const API_URL = 'http://localhost:3000';

export default function Home({ onLogout }: { onLogout: () => void }) {
  const [compras, setCompras] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [carteira, setCarteira] = useState([]);
  const [formCompra, setFormCompra] = useState({ ticker: '', quantidade: '', precoUnitario: '' });
  const [formPagamento, setFormPagamento] = useState({ compraId: '', valor: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchCompras();
    fetchPagamentos();
    fetchCarteira();
  }, []);

  const fetchCompras = async () => {
    const res = await fetch(`${API_URL}/compras`, { headers: { Authorization: `Bearer ${getToken()}` } });
    setCompras(await res.json());
  };

  const fetchPagamentos = async () => {
    const res = await fetch(`${API_URL}/pagamentos`, { headers: { Authorization: `Bearer ${getToken()}` } });
    setPagamentos(await res.json());
  };

  const fetchCarteira = async () => {
    const res = await fetch(`${API_URL}/carteira/resumo`, { headers: { Authorization: `Bearer ${getToken()}` } });
    setCarteira(await res.json());
  };

  const handleCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${API_URL}/compras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          ticker: formCompra.ticker,
          quantidade: Number(formCompra.quantidade),
          precoUnitario: Number(formCompra.precoUnitario)
        })
      });
      if (!res.ok) throw new Error('Erro ao criar compra');
      setFormCompra({ ticker: '', quantidade: '', precoUnitario: '' });
      setMsg('Compra criada!');
      fetchCompras();
      fetchCarteira();
    } catch (err) {
      setMsg('Erro ao criar compra');
    }
    setLoading(false);
  };

  const handlePagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${API_URL}/pagamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          compraId: Number(formPagamento.compraId),
          valor: Number(formPagamento.valor)
        })
      });
      if (!res.ok) throw new Error('Erro ao criar pagamento');
      setFormPagamento({ compraId: '', valor: '' });
      setMsg('Pagamento criado!');
      fetchPagamentos();
    } catch (err) {
      setMsg('Erro ao criar pagamento');
    }
    setLoading(false);
  };

  const processarPagamento = async (id: number, sucesso: boolean) => {
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${API_URL}/pagamentos/${id}/processar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ sucesso })
      });
      if (!res.ok) throw new Error('Erro ao processar pagamento');
      setMsg('Pagamento atualizado!');
      await fetchPagamentos();
      await fetchCompras(); // atualiza tabela de compras pra mostrar "Finalizado"
      await fetchCarteira();
    } catch (err) {
      setMsg('Erro ao processar pagamento');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Investment System</h1>
      <button style={{ float: 'right' }} onClick={() => { removeToken(); onLogout(); }}>Sair</button>
      {msg && <div className="msg">{msg}</div>}

      {/* 1. Comprar Ação */}
      <section>
        <h2>1. Comprar Ação</h2>
        <form onSubmit={handleCompra} className="form">
          <input placeholder="Ticker" value={formCompra.ticker} onChange={e => setFormCompra(f => ({ ...f, ticker: e.target.value }))} required />
          <input placeholder="Quantidade" type="number" value={formCompra.quantidade} onChange={e => setFormCompra(f => ({ ...f, quantidade: e.target.value }))} required />
          <input placeholder="Preço Unitário" type="number" value={formCompra.precoUnitario} onChange={e => setFormCompra(f => ({ ...f, precoUnitario: e.target.value }))} required />
          <button type="submit" disabled={loading}>Comprar</button>
        </form>
      </section>

      {/* 2. Compras Realizadas */}
      <section>
        <h2>2. Compras Realizadas</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ticker</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Valor Total</th>
              <th>Criar Pagamento</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((c: any) => {
              const pagamentoExecutado = pagamentos.find((p: any) => p.compraId === c.id && p.status === 'EXECUTADO');
              return (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.ticker}</td>
                  <td>{c.quantidade}</td>
                  <td>{c.precoUnitario}</td>
                  <td>{c.valorTotal}</td>
                  <td>
                    {pagamentoExecutado ? (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Finalizado</span>
                    ) : (
                      <form onSubmit={e => { e.preventDefault(); setFormPagamento({ compraId: c.id, valor: c.valorTotal }); }}>
                        <button type="submit" onClick={() => setFormPagamento({ compraId: c.id, valor: c.valorTotal })}>Pagar</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* 3. Criar Pagamento */}
      <section>
        <h2>3. Criar Pagamento</h2>
        <form onSubmit={handlePagamento} className="form">
          <input placeholder="Compra ID" value={formPagamento.compraId} onChange={e => setFormPagamento(f => ({ ...f, compraId: e.target.value }))} required />
          <input placeholder="Valor" type="number" value={formPagamento.valor} onChange={e => setFormPagamento(f => ({ ...f, valor: e.target.value }))} required />
          <button type="submit" disabled={loading}>Criar Pagamento</button>
        </form>
      </section>

      {/* 4. Pagamentos */}
      <section>
        <h2>4. Pagamentos</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Compra ID</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data Execução</th>
              <th>Ações</th>
              <th>Nome Ação</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.map((p: any) => {
              const compra = compras.find((c: any) => c.id === p.compraId);
              return (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.compraId}</td>
                  <td>{p.valor}</td>
                  <td>{p.status}</td>
                  <td>{p.dataExecucao ? new Date(p.dataExecucao).toLocaleString() : '-'}</td>
                  <td>
                    {p.status === 'PENDENTE' && (
                      <>
                        <button onClick={() => processarPagamento(p.id, true)} disabled={loading}>Finalizar</button>
                        <button onClick={() => processarPagamento(p.id, false)} disabled={loading}>Cancelar</button>
                      </>
                    )}
                  </td>
                  <td>{compra ? compra.ticker : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* 5. Resumo da Carteira */}
      <section>
        <h2>5. Resumo da Carteira</h2>
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Quantidade</th>
              <th>Preço Médio</th>
              <th>Total Investido</th>
            </tr>
          </thead>
          <tbody>
            {carteira.map((item: any, i: number) => (
              <tr key={i}>
                <td>{item.ticker}</td>
                <td>{item.quantidade}</td>
                <td>{item.precoMedio?.toFixed(2)}</td>
                <td>{item.totalInvestido?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
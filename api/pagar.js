export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    // Seu Token de Produção
    const token = 'APP_USR-3569449772779176-060613-4d4da2ad2c692ef18312e0c083055cde-3454161966';
    
    // Garante que a leitura do corpo da requisição seja perfeita
    let body = req.body;
    if (typeof body === 'string') {
        body = JSON.parse(body);
    }

    // Trava de segurança no servidor
    body.transaction_amount = 100;
    body.description = 'Planilha SIMPLE+ | Excellent Services';

    try {
        const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': Math.random().toString(36).substring(7)
            },
            body: JSON.stringify(body)
        });

        const data = await mpResponse.json();
        // Devolvemos a resposta exata para o site conseguir ler se deu erro ou sucesso
        res.status(200).json(data); 
    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}
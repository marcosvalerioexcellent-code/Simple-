export default async function handler(req, res) {
    // Configuração de CORS para permitir requisições do seu site
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    // Token de Produção REAL
    const token = 'APP_USR-4224848946478822-060613-ae9dcb429626bbeb6640bc1d9f56d166-214182211';
    
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);

    // Dados da transação (fixos para segurança)
    const payload = {
        transaction_amount: 100,
        description: 'Planilha SIMPLE+',
        payment_method_id: 'pix',
        payer: {
            email: body.payer?.email || 'cliente@exemplo.com',
            first_name: 'Cliente',
            last_name: 'Simple'
        }
    };

    try {
        const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': Math.random().toString(36).substring(7)
            },
            body: JSON.stringify(payload)
        });

        const data = await mpResponse.json();
        res.status(200).json(data); 
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar pagamento no servidor' });
    }
}
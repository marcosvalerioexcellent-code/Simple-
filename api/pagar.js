export default async function handler(req, res) {
    // Permissões de segurança para o Vercel não bloquear seu site
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Libera a checagem de segurança do navegador (Preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    // Seu Token de Produção
    const token = 'APP_USR-3569449772779176-060613-4d4da2ad2c692ef18312e0c083055cde-3454161966';
    
    // Garante que o Vercel consiga ler os dados corretamente
    let body = req.body;
    if (typeof body === 'string') {
        body = JSON.parse(body);
    }

    // Trava de segurança no servidor para ninguém alterar o preço no código
    body.transaction_amount = 100;
    body.description = 'Planilha SIMPLE+ | Excellent Services';

    try {
        const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                // Uma chave única exigida pelo MP para não duplicar cobranças
                'X-Idempotency-Key': Math.random().toString(36).substring(7) 
            },
            body: JSON.stringify(body)
        });

        const data = await mpResponse.json();
        
        // Devolve a resposta exata para o site
        res.status(200).json(data); 
    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor do Vercel' });
    }
}
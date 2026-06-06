export default async function handler(req, res) {
    const token = 'APP_USR-3569449772779176-060613-4d4da2ad2c692ef18312e0c083055cde-3454161966';
    const { id } = req.query;

    if (!id) return res.status(400).json({ error: 'ID ausente' });

    try {
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await mpResponse.json();
        res.status(200).json({ status: data.status });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}
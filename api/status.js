export default async function handler(req, res) {
    // Token de Produção REAL (deve ser o mesmo usado em pagar.js)
    const token = 'APP_USR-4224848946478822-060613-ae9dcb429626bbeb6640bc1d9f56d166-214182211';
    const { id } = req.query;

    if (!id) return res.status(400).json({ error: 'ID da transação ausente' });

    try {
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await mpResponse.json();
        res.status(200).json({ status: data.status });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar status' });
    }
}
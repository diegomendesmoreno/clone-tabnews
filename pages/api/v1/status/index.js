function status(request, response) {
  response.status(200).json({ chave: "Endpoint de status funcionando" });
}

export default status;

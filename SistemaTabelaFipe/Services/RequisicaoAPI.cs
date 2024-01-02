using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SistemaTabelaFipe.Models.Models;
using SistemaTabelaFipe.Services.Interfaces;

namespace SistemaTabelaFipe.Services
{
    public class RequisicaoAPI : IRequisicaoAPI
    {
        private readonly string _url = "https://parallelum.com.br/fipe/api/v1/";

        public async Task<string> Api(Veiculo veiculo)
        {
            string url = _url + $"{veiculo.Caracteristica}/marcas/";
            url += veiculo.Marca != null ? $"{veiculo.Marca}/modelos/" : "";
            url += veiculo.Modelo != null ? $"{veiculo.Modelo}/anos/" : "";
            url += veiculo.AnoModelo != null ? $"{veiculo.AnoModelo}" : "";

            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<List<DadosVeiculo>> GetMarcaAnoModelo(Veiculo veiculo)
        {
            string retorno = await Api(veiculo);

            List<DadosVeiculo> dados =
                JsonConvert.DeserializeObject<List<DadosVeiculo>>(retorno);

            return dados;

        }

        public async Task<ListaModelos> GetModelo(Veiculo veiculo)
        {
            string retorno = await Api(veiculo);

            ListaModelos dados = JsonConvert.DeserializeObject<ListaModelos>(retorno);

            return dados;

        }

        public async Task<TabelaFipe> Resultado(Veiculo veiculo)
        {
            string retorno = await Api(veiculo);

            TabelaFipe tabela = JsonConvert.DeserializeObject<TabelaFipe>(retorno);

            return tabela;

        }      
    }
}

using SistemaTabelaFipe.Models.Models;

namespace SistemaTabelaFipe.Services.Interfaces
{
    public interface IRequisicaoAPI
    {
        Task<List<DadosVeiculo>> GetMarcaAnoModelo(Veiculo veiculo);
        Task<ListaModelos> GetModelo(Veiculo veiculo);
        Task<TabelaFipe> Resultado(Veiculo veiculo);
    }
}

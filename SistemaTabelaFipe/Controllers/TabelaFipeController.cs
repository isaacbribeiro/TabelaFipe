using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using SistemaTabelaFipe.Models.Models;
using SistemaTabelaFipe.Services.Interfaces;

namespace SistemaTabelaFipe.Controllers
{
    public class TabelaFipeController : Controller
    {
        private readonly IRequisicaoAPI _requisicaoAPI;

        public TabelaFipeController(IRequisicaoAPI requisicaoAPI)
        {
            _requisicaoAPI = requisicaoAPI;
        }
    
        public async Task<IActionResult> RetornarDadosMarcaAnoModelo(Veiculo veiculo)
        {
            List<DadosVeiculo> dados = await _requisicaoAPI.GetMarcaAnoModelo(veiculo);
        
            return new JsonResult(null)
            {
                Value = new
                {
                    SelectMarca = RenderPartialViewCompletaToStringAsync
                    ("/Views/ElementosHtml/SelectHtml/SelectMarca.cshtml",dados).Result,
                    SelectAnoModelo = RenderPartialViewCompletaToStringAsync
                    ("/Views/ElementosHtml/SelectHtml/SelectAnoModelo.cshtml", dados).Result                   
                }

            };
        }

        public async Task<IActionResult> RetornarDadosModelo(Veiculo veiculo)
        {
            ListaModelos dados = await _requisicaoAPI.GetModelo(veiculo);

            return PartialView("/Views/ElementosHtml/" +
            "SelectHtml/SelectModelo.cshtml", dados);

        }

        public async Task<IActionResult> ResultadoTabelaFipe(Veiculo veiculo)
        {
            TabelaFipe tabela = await _requisicaoAPI.Resultado(veiculo);

            return PartialView("/Views/ElementosHtml/" +
            "Tabelas/TabelaFipe.cshtml", tabela);

        }

        private async Task<string> RenderPartialViewCompletaToStringAsync(string viewPath, object model)
        {
            var viewEngine = HttpContext.RequestServices.GetService<ICompositeViewEngine>();

            var viewResult = viewEngine.GetView(null, viewPath, false);

            if (!viewResult.Success)
            {
                throw new InvalidOperationException($"A View '{viewPath}' não foi encontrada");
            }

            var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
            {
                Model = model
            };

            using (var stringWriter = new StringWriter())
            {
                var viewContext = new ViewContext(
                    ControllerContext,
                    viewResult.View,
                    viewData,
                    TempData,
                    stringWriter,
                    new HtmlHelperOptions()
                );

                await viewResult.View.RenderAsync(viewContext);

                return stringWriter.ToString();
            }
        }       

    }
}
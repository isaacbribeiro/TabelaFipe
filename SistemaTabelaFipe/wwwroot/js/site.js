function SelecionarVeiculo(veiculo, id) {
    var botoesAtivos = document.querySelectorAll('.btnActive')
    for (var i = 0; i < botoesAtivos.length; i++) {
        botoesAtivos[i].className = "btn"
    }
    document.getElementById(id).className = "btnActive"
    LimparSelect("selectMarca", "Marca")
    LimparSelect("selectModelo", "Modelo")
    LimparSelect("selectAnoModelo", "Ano Modelo")
    VeiculoSelecionadoRetornaMarca(veiculo)
}

function VeiculoSelecionadoRetornaMarca(veiculo) {

    $.ajax({
        type: "POST",
        url: '/TabelaFipe/RetornarDadosMarcaAnoModelo',
        data: veiculo,
        success: function (result) {

            $("#selectMarca").html(result.selectMarca)
            var selectMarca = document.getElementById("selectMarca");
            selectMarca.onchange = SelectMarcaRetornaModelo.bind(null, veiculo)
         
            document.getElementById("btnPesquisar").onclick = Pesquisar.bind(null,
                veiculo.caracteristica)
        },
        error: function (result) {
            console.log("erro");
        }
    });

}

function SelectMarcaRetornaModelo(veiculo) {

    var selectMarca = document.getElementById("selectMarca");
    veiculo.Marca = selectMarca.value
    veiculo.Modelo = null

    $.ajax({
        type: "POST",
        url: '/TabelaFipe/RetornarDadosModelo',
        data: veiculo,
        success: function (result) {

            $("#selectModelo").html(result)         
            LimparSelect("selectAnoModelo","Ano Modelo")
        
            var selectModelo = document.getElementById("selectModelo")        
            selectModelo.onchange = SelectModeloRetornaAnoModelo.bind(null, veiculo)
         
        },
        error: function (result) {
            console.log("erro");
        }
    });

}

function SelectModeloRetornaAnoModelo(veiculo) {

    var selectModelo = document.getElementById("selectModelo");
    veiculo.Modelo = selectModelo.value

    $.ajax({
        type: "POST",
        url: '/TabelaFipe/RetornarDadosMarcaAnoModelo',
        data: veiculo,
        success: function (result) {

            $("#selectAnoModelo").html(result.selectAnoModelo)

        },
        error: function (result) {
            console.log("erro");
        }
    });

}

function Pesquisar(caracteristica) {
    let marca = document.getElementById("selectMarca").value
    let modelo = document.getElementById("selectModelo").value
    let anoModelo = document.getElementById("selectAnoModelo").value
    veiculo = {
        caracteristica,
        marca,
        modelo,
        anoModelo
    }
    if (marca != "" && modelo != "" && anoModelo != "") {
        $.ajax({
            type: "POST",
            url: '/TabelaFipe/ResultadoTabelaFipe',
            data: veiculo,
            success: function (result) {
                $("#ModalResultadoTabelaFipe").modal("show")
                $("#tabelaFipe").html(result)
            },
            error: function (result) {
            }
        });
    }
}

function LimparSelect(id, descricao) {   
    let htmlSelect = `<select id='${id}'> <option value=''
            disabled selected>${descricao}</option></select>`
    $("#" + id).html(htmlSelect)
}
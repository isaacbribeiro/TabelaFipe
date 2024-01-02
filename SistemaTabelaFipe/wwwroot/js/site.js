//function MaisOption(id, caracteristica) {
//    VeiculoSelecionadoRetornaMarca({ caracteristica: caracteristica })

//    var icos = document.getElementsByClassName("bx bx-chevron-up");
//    for (var i = 0; i < icos.length; i++) {
//        icos[i].className = "bx bx-chevron-down";
//    }

//    let ico = document.getElementById(id)
//    ico.className = "bx bx-chevron-up"
//    ico.onclick = MenosOption.bind(null, id, caracteristica)

//    var divs = document.getElementsByClassName("divMaisOption");
//    for (var i = 0; i < divs.length; i++) {
//        divs[i].innerHTML = "";
//    }

//    document.getElementById("divMaisOption-" + caracteristica).innerHTML = document.getElementById("divMaisOptionNone").innerHTML
//}

//function MenosOption(id, caracteristica) {
//    let ico = document.getElementById(id)
//    ico.className = "bx bx-chevron-down"
//    ico.onclick = MaisOption.bind(null, id, caracteristica)
//    document.getElementById("divMaisOption-" + caracteristica).innerHTML = ""
//}

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
function start(){

    $("#inicio").hide();

    $("#fundo").append("<div id='jogador' class='animal'></div>");
    $("#fundo").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundo").append("<div id='inimigo2' ></div>");
    $("#fundo").append("<div id='amigo' class='anima3'></div>");
    $("#fundo").append("<div id='placar'></div>");
    $("#fundo").append("<div id='energia'></div>");



// Principais variáveis do jogo
var podeAtirar=true;
var fimdejogo= false;
var pontos=0;
var salvos=0;
var perdidos=0;
var energiaAtual=3;
var jogo = { };
var velocidade=5;
var posicaoY = parseInt(Math.random() * 334);
var TECLA = {
    W: 87,
    S: 83,
    D: 68
}

jogo.pressionou = [];



//Verifica se o usuário pressionou alguma tecla
$(document).keydown(function(e) {
    jogo.pressionou[e.which] = true;
});

$(document).keyup(function(e) {
    jogo.pressionou[e.which] = false;
});



//Game Loop
jogo.timer = setInterval(loop, 30);

function loop() {

    movefundo();
    movejogador();
    moveinimigo1();
    moveinimigo2();
    movefriend();
    colisao();
    placar();   
    energia();
    
} 


   function movefundo() {

    esquerda = parseInt($("#fundo").css("background-position"));
    $("#fundo").css("background-position", esquerda-1);
} 


//movimentação jogador principal
    function movejogador(){

        if(jogo.pressionou[TECLA.W]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo-10);

            //limitação da movimentação, do helicóptero
            if (topo<=0){
                $("#jogador").css("top", topo + 10);
            }
        }

        if (jogo.pressionou[TECLA.S])   {
            var topo = parseInt($("#jogador").css("top"));
            //topo + 10 - para baixo
            $("#jogador").css("top",topo+10);

            //topo>=posicao 
            if (topo>=438){
                $("#jogador").css("top", topo-10);
            }
        }

        //disparo
        if(jogo.pressionou[TECLA.D]){
            disparo();
        }
    }

    
    //movimentação do amigo e inimigos
    function moveinimigo1 (){

        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",posicaoX-velocidade);
        $("#inimigo1").css("top",posicaoY);

            if(posicaoX<=0){
                posicaoY = parseInt(Math.random() * 334);
                $("#inimigo1").css("left", 694);
                $("#inimigo1").css("top", posicaoY);
            }
    }

    function moveinimigo2(){

        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX-3);
     
        //reposicionamento
        if(posicaoX<=0){
            $("#inimigo2").css("left", 775);
        }
        
    }

    function movefriend(){

        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX+1);

        //chegando na posição 906, volta para a posição inicial
        if (posicaoX>906){
            $("#amigo").css("left", 0);
        }
    }



    //Atirando com o helicóptero
    function disparo() {
	
        if (podeAtirar==true) {
            
        podeAtirar=false;
        
        topo = parseInt($("#jogador").css("top"))
        posicaoX= parseInt($("#jogador").css("left"))
        tiroX = posicaoX + 190;
        topoTiro=topo+37;
        $("#fundo").append("<div id='disparo'></div");
        $("#disparo").css("top",topoTiro);
        $("#disparo").css("left",tiroX);
        
        var tempoDisparo=window.setInterval(executaDisparo, 30);
        
        } 


    function executaDisparo() {
    posicaoX = parseInt($("#disparo").css("left"));
    $("#disparo").css("left",posicaoX+15); 

        if (posicaoX>900) {
                    
        window.clearInterval(tempoDisparo);
        tempoDisparo=null;
        $("#disparo").remove();
        podeAtirar=true;
                
             }
        }
    } // END DISPARO


//ERRO POR AQUI
//Explosões
function colisao() {
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));        
        
        // jogador com o inimigo1
    if (colisao1.length>0) {       

        energiaAtual--;
        inimigo1X = parseInt($("#inimigo1").css("left"));
        inimigo1Y = parseInt($("#inimigo1").css("top"));
        explosao1(inimigo1X,inimigo1Y);
            
        posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left",694);
        $("#inimigo1").css("top",posicaoY);
      
    } 

    // jogador com o inimigo2 
    if (colisao2.length>0) {
	
        inimigo2X = parseInt($("#inimigo2").css("left"));
        inimigo2Y = parseInt($("#inimigo2").css("top"));
        explosao2(inimigo2X,inimigo2Y);
                
        $("#inimigo2").remove();
            
        reposicionaInimigo2(); 
        //chamando a função, o jogo abre corretamente no mozilla Firefox
    }

    //inimigo atingido
    if (colisao3.length>0){

        pontos = pontos + 100;
        inimigo1X = parseInt($("#inimigo1").css("left"));
        inimigo1Y = parseInt($("#inimigo1").css("top"));

        explosao1(inimigo1X, inimigo1Y);
        $("#disparo").css("left",950);

        posicaoY = parseint(Math.random() * 334);
        $("#inimigo1").css("left", 694);
        $("#inimigo1").css("top", posicaoY);


    }

    //inimigo atingido
    if (colisao4.length>0){

        pontos=pontos+50;

        inimigo2X = parseInt($("#inimigo1").css("left"));
        inimigo2Y = parseInt($("#inimigo1").css("top"));
        $("#inimigo2").remove();

        explosao2(inimigo2X, inimigo2Y);
        $("#disparo").css("left",950);

       reposicionaInimigo2();

    }

    //player with friend
    if (colisao5.length>0){

        salvos++;
        reposicionaAmigo();
        $("#amigo").remove();

    }


    if(colisao6.length>0){

        perdidos++;
        amigoX = parseInt($("#amigo").css("left"));
        amigoY = parseInt($("#amigo").css("top"));
        explosao3(amigoX, amigoY);
        $("#amigo").remove();

        reposicionaAmigo();
    }
} //END COLISAO
    
    
//Explosão 1
function explosao1(inimigo1X,inimigo1Y) {
    
    $("#fundo").append("<div id='explosao1'></div");
	$("#explosao1").css("background-image", "url(imgs/explosao.png)");
	var div=$("#explosao1");
	div.css("top", inimigo1Y);
	div.css("left", inimigo1X);
	div.animate({width:200, opacity:0}, "slow");
	
	var tempoExplosao=window.setInterval(removeExplosao, 1000);
	
		function removeExplosao() {
			
			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao=null;
			
		}
        
    }

     function reposicionaInimigo2(){

        //5 SECONDS
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

            function reposiciona4(){
                window.clearInterval(tempoColisao4);
                tempoColisao4=null;

                if(fimdejogo==false){

                $("#fundo").append("<div id=inimigo2></div");
            }
        }
    }
        

    //Explosão 2
	function explosao2(inimigo2X,inimigo2Y) {
	
	$("#fundo").append("<div id='explosao2'></div");
	$("#explosao2").css("background-image", "url(imgs/explosao2.png)");
	var div2=$("#explosao2");
	div2.css("top", inimigo2Y);
	div2.css("left", inimigo2X);
	div2.animate({width:200, opacity:0}, "slow");
	
	var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
	
		function removeExplosao2() {
			
			div2.remove();
			window.clearInterval(tempoExplosao2);
			tempoExplosao2=null;
    	}
   } 


    function reposicionaAmigo() {

        var tempoAmigo=window.setInterval(reposiciona6, 6000);

        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo=null;

            if (fimdejogo==false){
                $("#fundo").append("div id='amigo' class='anima3'></div");
            }
       }
   } //end


//Explosão3	
function explosao3(amigoX,amigoY) {
    $("#fundo").append("<div id='explosao3' class='anima4'></div");
    $("#explosao3").css("top",amigoY);
    $("#explosao3").css("left",amigoX);
    
    var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
    
    function resetaExplosao3() {
    $("#explosao3").remove();
    window.clearInterval(tempoExplosao3);
    tempoExplosao3=null;
            
    }
}

function placar(){

    $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");

}
    

function energia() {

    if (energiaAtual==3) {
        
        $("#energia").css("background-image", "url(imgs/energia3.png)");
    }

    if (energiaAtual==2) {
        
        $("#energia").css("background-image", "url(imgs/energia2.png)");
    }

    if (energiaAtual==1) {
        
        $("#energia").css("background-image", "url(imgs/energia1.png)");
    }

    if (energiaAtual==0) {
        
        $("#energia").css("background-image", "url(imgs/energia0.png)");
        
        //Game Over
        }
    }


    
    
    
} // end start
    

    


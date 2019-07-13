$(document).ready(function(){
    var started = false; //spremenljivka, ki spremlja, če je igra že bila začeta
    var matrika = [];
    var mine = 0;
    
    var poljeSlider = document.getElementById("poljeSlider");
    var dolociPolje = document.getElementById("dolociPolje");
    dolociPolje.innerHTML = poljeSlider.value;

    poljeSlider.oninput = function() {
        dolociPolje.innerHTML = this.value;
    }

    var pokritostSlider = document.getElementById("pokritostSlider");
    var dolociPokritost = document.getElementById("dolociPokritost");
    dolociPokritost.innerHTML = pokritostSlider.value;

    pokritostSlider.oninput = function() {
        dolociPokritost.innerHTML = this.value;
    }

    $("#rezultati").hide();

    $("#gumbZacni").click(function(){
        if(started == true){
            alert("Igra že teče");
            return -1;
        }
        started = true;

        /*
        time = 0;
        setInterval(timer(), 1000);
*/
        for(i = 0; i < poljeSlider.value; i++){
            matrika[i] = new Array(poljeSlider.value)
            $("#tabela").append("<tr>");
            for(j = 0; j < poljeSlider.value; j++){
                random = Math.random(0, 100);
                vrednost = 0;
                if(random<=pokritostSlider.value/100.0){
                    vrednost = -1;
                    mine++;
                }
                matrika[i][j] = vrednost;
                $("#tabela").append("<td id=" + (i*1000+j) + "><div class='tdPokrito'></div></td>") //ustavi ij, da se jih lahko potem ob kliku dobi
            }
            $("#tabela").append("</tr>");
            $("#mine").html(mine);
        }

        //sedaj pa še preuredi matriko

        for(i = 0; i<poljeSlider.value; i++){
            for(j = 0; j<poljeSlider.value; j++){
                if(matrika[i][j] != -1){
                    //preveri zgornjo vrstico
                    try{ if(matrika[i-1][j-1] == -1) matrika[i][j]++; } catch {}
                    try{ if(matrika[i-1][j] == -1) matrika[i][j]++; } catch {}
                    try{ if(matrika[i-1][j+1] == -1) matrika[i][j]++; } catch {}
                    //preveri srednjo vrstico
                    try{ if(matrika[i][j-1] == -1) matrika[i][j]++; } catch {}
                    try{ if(matrika[i][j+1] == -1) matrika[i][j]++; } catch {}
                    //preveri spodnjo vrstico
                    try{ if(matrika[i+1][j+1] == -1) matrika[i][j]++; } catch {}
                    try{ if(matrika[i+1][j-1] == -1) matrika[i][j]++; } catch {}
                    try{ if(matrika[i+1][j] == -1) matrika[i][j]++; } catch {}
                }
            }
        }
        
        $(".tdPokrito").mousedown(function(e){
            if(e.which == 2){
                e.preventDefault();
                $(this).attr("class", "flag");
            }
        });
        
       
       
        $(document).ready(function(){ 
            document.oncontextmenu = function() { return false; };
    
            
        
            $(".tdPokrito").mousedown(function(e){
                if( e.button == 2 && $(this).class() == ".tdPokrito") {
                    $(this).removeClass("tdPokrito").addClass("flag");
                    mine--;
                    $("#mine").html(mine);
                    return false; 
                } 
                return true; 
            });  
        });



        prostaPolja = poljeSlider-mine;
        $("td div").parent().click(function(){
            v = Math.floor(this.id / 1000); //vrstica
            s = this.id % 1000; // stolpec
            retn = preveri(matrika, v, s, poljeSlider.value)
            if(retn == 1){
                koncaj(0); //izgubil - ne shrani v local storage
            }
            if(prostaPolja == 0){
                koncaj(1); //zmagal - shrani v local storage
            }
        });

        
        $("#naRezultate").click(function(){
            if(started == true) {
                $(window).on('beforeunload', function(){
                    return "Ali želite zapustiti stran?";
                });
            }
        });
    });

    // $(window).on('beforeunload', function(){
    //     if(started) return 'Are you sure you want to leave?';
    // });
    
    // $(window).on('unload', function(){
    
    //         logout();
    
    // });


});





//preveri klik

function preveri(matrika, i, j, max){
    if(i<0 || j<0 || j>=max || i>=max || this.started == false){
        return -1;
    }
    if(typeof(obiskano) == "undefined") {
        obiskano = new Array(max);
        for (k=0; k<max; k++) {
            obiskano[k] = new Array(max);
        }
        for (k=0; k<max; k++){
            for(l=0; l<max; l++){
                obiskano[k][l] = 0;
            }
        }
    }

    if(obiskano[i][j] == 1){
        return -1;
    }

    obiskano[i][j] = 1;
    
    newElement = "#" + (i*1000+j) + " div";
    if(matrika[i][j] > 0){ 
        $(newElement).attr("class", "class" + matrika[i][j]);
    }else if(matrika[i][j] == -1){
        for(m=0; m<max; m++){
            for(n=0; n<max; n++){
                if(matrika[m][n] == -1){
                    $("#"+ (m*1000+n) + " div").attr("class", "bomb");
                }
            }
        }
        prostaPolja--;
        $(newElement).addClass("final");
        started = false;
        return 1;
    }else if(matrika[i][j] == 0 && matrika[i][j] != -1){
        prostaPolja--;
        $(newElement).addClass("odkrito").delay(2000);
        $(newElement).attr("class", "");
        //preveri zgornjo vrstico
        preveri(matrika, i-1, j-1);
        preveri(matrika, i-1,j );
        preveri(matrika, i-1,j+1 ) ;
        //preveri srednjo vrstico
        preveri(matrika,i,j-1 );
        preveri(matrika,i,j+1 ) ;
        //preveri spodnjo vrstico
        preveri(matrika,i+1,j+1 ) ;
        preveri(matrika,i+1,j-1 ) ;
        preveri(matrika,i+1,j );
    }
}

function koncaj(izid){
    started = false;

    $("#rezultati").show();
    stMin = $("#stMin").html(pokritostSlider.value);
    velPolja = $("#velikostPolja").html(poljeSlider.value + "x" + poljeSlider.value);
    casResevanja = $("#casResevanja").html();


    $("#rezultati button").click(function(){
        usr = $("#usr").html()
        localStorage.setItem(hash(usr+stMin+velPolja), JSON.stringify({usr: "usr", stMin: "stMin", velPolja: 'velPolja'}));
    });

    $("#novaIgra").click(function(){
        window.location.reload(false);
    });

    $("#redirectRez").click(function(){
        window.location.href = './rezultati.html';
    });
    

}

function timer(){
    time++;
    ure = Math.floor(time / 3600)
    minute = Math.floor((time / 60) % 60);
    sekunde = time % 60;

    $("#ure").html(ure);
    $("#minute").html(minute);
    $("#sekunde").html(sekunde);
}

function hash (string){
    var hash = 0;
    if (string.length == 0) return hash;
    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
}
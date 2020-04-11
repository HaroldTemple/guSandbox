(function(){

    const DEBUG = true

    if(!window["guSandbox"]){
        window.guSandbox = {}
    }

    function debug(log){

        if( ! DEBUG ) return

        console.log(log)
    }

    guSandbox.iniciarTest = function(codigo){

        new Ejecutor(codigo).iniciar()

    }

    guSandbox.envioDeScript = async function(codigo){

        console.log(codigo)

        return fetch("/cargar", {
 
            headers:{
                'Content-Type': 'application/json'
            },

            method: "POST",

            body: JSON.stringify({codigo})
        
        }).then((body) => {
 
            return body.json()

        }).then((datos) => {
        
            return `/script_usuario/${datos.codigo}`
        })

    }

    guSandbox.nuevoContexto = async function(codigo, scripts){

        const script = await guSandbox.envioDeScript(codigo);

        const ctx = document.createElement("iframe")

        ctx.sandbox = "allow-scripts allow-same-origin"

        ctx.src = "ejecutor.html"

        document.getElementById("contextos").appendChild(ctx)

        guSandbox.instalarBuzon(document, function(mensaje){
        
            debug(`Instalando buzon de mensajes`)

            switch(mensaje.respuesta){

                case "LISTO":

                    guSandbox.mensajeEnviar({
                    
                        tipo: "INICIAR",

                        codigo: script,

                        tests: scripts
                    
                    })

                    break;

                case "TERMINADO":
                    localStorage.setItem("ejecucion", mensaje.mostrar)
                    window.location.reload()

            }
        
        })

    }

    guSandbox.mensajeEnviar = function(mensaje, frame){

        console.log(`[${ frame ? "padre" : "hijo" }] Enviando mensaje ${JSON.stringify(mensaje, null, 4)}`)

        let evento = new CustomEvent("mensaje", { detail: JSON.stringify(mensaje) })
    
        if( frame ){
            frame.contentDocument.dispatchEvent(evento)
        }
        else{
            window.parent.document.dispatchEvent(evento)
        }
    }

    guSandbox.instalarBuzon = function(documento, callback){

        documento.addEventListener("mensaje", function(mensaje){
        
            mensaje = JSON.parse(mensaje.detail)
        
            console.log(`Recibido mensaje ${JSON.stringify(mensaje, null, 4)}`)

            callback(mensaje)
        })

    }

    class Ejecutor{

        constructor(codigo){

            this.codigo = codigo

        }

        iniciar(){

            mocha.checkLeaks()

            mocha.run((failures) => {
            
                this.terminar(failures)
            
            })
        }

        terminar(fallos){

            guSandbox.mensajeEnviar({
            
                respuesta: "TERMINADO",

                mostrar: document.getElementById("mocha").innerHTML
            
            })

        }
    }


})()

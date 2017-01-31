do () ->

	#Control timeout
	@timeRemove = 0

	@ctrlError = (instantClean) =>
		if instantClean
			$(".error").fadeOut 300
		else
			clearTimeout @timeRemove
			$(".error").empty()
			$(".error").fadeIn 300

			@timeRemove = setTimeout ->
				$(".error").fadeOut 300, ->
					$(this).empty()
			, 5000

	@msgErro = (msg) =>
		switch msg
			when "vantage"
				@ctrlError()
				$("<p>Você precisa de pelo menos 1 ponto em Atributos ou Habilidades para conseguir realizar o teste.</p>").appendTo(".error");
			else
				@ctrlError()
				$("<p>Você não possuí dados para realizar o teste.</p>").appendTo(".error");


	@msgResultado = (msg,resultado,dados) =>
		listNode = $ "<li>"

		switch msg
			when "sorte"
				description = "<p><strong>#{@infoTeste.nome}</strong>: rolou um teste de sorte.</p>"

				result = "<p><strong class='cp-font-red'>Resultado:</strong> <em class='cp-font-white'>#{resultado}</em></p>"

				dados = "<p><strong class='cp-font-red'>Dado:</strong> <em class='cp-font-white'>#{dados}</em></p>"

				$(listNode).append description
				$(listNode).append result
				$(listNode).append dados
				$(".lista-resultados > p").remove()
				$(".lista-resultados ul").prepend $ listNode
			when "init"
				description = "<p><strong>#{@infoTeste.nome}</strong>: rolou iniciativa.</p>"

				result = "<p><strong class='cp-font-red'>Resultado:</strong> <em class='cp-font-white'>Iniciativa #{resultado}</em></p>"

				dados = "<p><strong class='cp-font-red'>Rolagem:</strong> <em class='cp-font-white'>#{dados}</em></p>"

				$(listNode).append description
				$(listNode).append result
				$(listNode).append dados
				$(".lista-resultados > p").remove()
				$(".lista-resultados ul").prepend $ listNode
			else
				description = "<p><strong>#{@infoTeste.nome}</strong>: rolou <strong class='cp-font-blue'>#{@infoTeste.rolagemPadrao}</strong> dados para #{@infoTeste.acao}.</p>"

				result = "<p><strong class='cp-font-red'>Resultado:</strong> <em class='cp-font-white'>#{resultado}</em></p>"

				dados = "<p><strong class='cp-font-red'>Dados:</strong> <em class='cp-font-white'>#{dados}</em></p>"

				$(listNode).append description
				$(listNode).append result
				$(listNode).append dados
				$(".lista-resultados > p").remove()
				$(".lista-resultados ul").prepend $ listNode
			

	@rolarDados = (sistema) =>
		count = new Number (1)
		failure = new Number(0)
		rolagens = new Array()
		resultado = new Array()

		while count <= @infoTeste.rolagemPadrao
			dice = Math.round Math.random() * (10 - 1) + 1

			if dice is 10
				rolagens.push dice
			else if dice is 1
				rolagens.push dice
				failure++
				count++
			else
				rolagens.push dice
				count++
		
		for rolagem in rolagens
			if rolagem >= @infoTeste.dificuldade
				resultado.push rolagem

		if sistema is "mascara"
			resultado = resultado.length + @infoTeste.sucessosAuto - failure
		else
			resultado = resultado.length + @infoTeste.sucessosAuto

		if resultado is 0
			resultado = "Falha."
			@msgResultado("default",resultado,rolagens)
		else if resultado < 0
			resultado = "Falha Crítica."
			@msgResultado("default",resultado,rolagens)
		else
			resultado = resultado + " Sucessos."
			@msgResultado("default",resultado,rolagens)

	@iniciativa = () =>
		iniciativa = Math.round Math.random() * 10
		resultado = @infoTeste.atributo + @infoTeste.habilidade + @infoTeste.vantagens + iniciativa - @infoTeste.penalidade
		@msgResultado("init",resultado,iniciativa)

	@sorte = () =>
		dado = Math.round Math.random() * (10 - 1) + 1 

		if dado is 10
			resultado = "Sucesso"
			@msgResultado("sorte",resultado,dado)
		else if dado is 1
			resultado = "Falha crítica"
			@msgResultado("sorte",resultado,dado)
		else 
			resultado = "Falha"
			@msgResultado("sorte",resultado,dado)

	@init = () =>
		$(".cp-radio").on "click", (event) ->
			targetID = "#" + $(this).attr "id"
			$(targetID).children("input[type=radio]").prop "checked", yes

			$(".cp-radio").children(".button").html "&nbsp;"
			$(targetID).children(".button").html "X"

		$("#rolar,#iniciativa,#sorte").on "click", (event) =>
			event.preventDefault()

			targetID = event.target.id
			sistemaID = $(".cp-radio input[type=radio]:checked").parent(".cp-radio").attr "id"

			@ctrlError yes
			
			@infoTeste =
				nome: $("#nome").val()
				acao: $("#acao").val()
				atributo: Number $("#atributo").val()
				habilidade: Number $("#habilidade").val()
				vantagens: Number $("#vantagens").val()
				penalidade: Number $("#penalidades").val()
				sucessosAuto: Number $("#sucesso").val()
				dificuldade: Number $("#dificuldade").val()
				rolagemPadrao: new Number()

			if @infoTeste.nome is "" and @infoTeste.acao is ""
				@infoTeste.nome = "Personagem/NPC"
				@infoTeste.acao = "realizar alguma ação"
			else if @infoTeste.nome is ""
				@infoTeste.nome = "Personagem/NPC"
			else
				@infoTeste.acao = "realizar alguma ação"

			@infoTeste.rolagemPadrao = @infoTeste.atributo + @infoTeste.habilidade + @infoTeste.vantagens - @infoTeste.sucessosAuto - @infoTeste.penalidade

			if targetID is "rolar"
				if (@infoTeste.atributo <= 0 and @infoTeste.habilidade <= 0) and @infoTeste.vantagens > 0
					@msgErro "vantage"
				else if @infoTeste.rolagemPadrao <= 0
					@msgErro "default"
				else
					@rolarDados(sistemaID)

			else if targetID is "iniciativa"
				@iniciativa()
			else
				@sorte()
					
	$ () => @init()

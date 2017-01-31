(function() {
  this.timeRemove = 0;
  this.ctrlError = (function(_this) {
    return function(instantClean) {
      if (instantClean) {
        return $(".error").fadeOut(300);
      } else {
        clearTimeout(_this.timeRemove);
        $(".error").empty();
        $(".error").fadeIn(300);
        return _this.timeRemove = setTimeout(function() {
          return $(".error").fadeOut(300, function() {
            return $(this).empty();
          });
        }, 5000);
      }
    };
  })(this);
  this.msgErro = (function(_this) {
    return function(msg) {
      switch (msg) {
        case "vantage":
          _this.ctrlError();
          return $("<p>Você precisa de pelo menos 1 ponto em Atributos ou Habilidades para conseguir realizar o teste.</p>").appendTo(".error");
        default:
          _this.ctrlError();
          return $("<p>Você não possuí dados para realizar o teste.</p>").appendTo(".error");
      }
    };
  })(this);
  this.msgResultado = (function(_this) {
    return function(msg, resultado, dados) {
      var description, listNode, result;
      listNode = $("<li>");
      switch (msg) {
        case "sorte":
          description = "<p><strong>" + _this.infoTeste.nome + "</strong>: rolou um teste de sorte.</p>";
          result = "<p><strong class='cp-font-red'>Resultado:</strong> <em class='cp-font-white'>" + resultado + "</em></p>";
          dados = "<p><strong class='cp-font-red'>Dado:</strong> <em class='cp-font-white'>" + dados + "</em></p>";
          $(listNode).append(description);
          $(listNode).append(result);
          $(listNode).append(dados);
          $(".lista-resultados > p").remove();
          return $(".lista-resultados ul").prepend($(listNode));
        case "init":
          description = "<p><strong>" + _this.infoTeste.nome + "</strong>: rolou iniciativa.</p>";
          result = "<p><strong class='cp-font-red'>Resultado:</strong> <em class='cp-font-white'>Iniciativa " + resultado + "</em></p>";
          dados = "<p><strong class='cp-font-red'>Rolagem:</strong> <em class='cp-font-white'>" + dados + "</em></p>";
          $(listNode).append(description);
          $(listNode).append(result);
          $(listNode).append(dados);
          $(".lista-resultados > p").remove();
          return $(".lista-resultados ul").prepend($(listNode));
        default:
          description = "<p><strong>" + _this.infoTeste.nome + "</strong>: rolou <strong class='cp-font-blue'>" + _this.infoTeste.rolagemPadrao + "</strong> dados para " + _this.infoTeste.acao + ".</p>";
          result = "<p><strong class='cp-font-red'>Resultado:</strong> <em class='cp-font-white'>" + resultado + "</em></p>";
          dados = "<p><strong class='cp-font-red'>Dados:</strong> <em class='cp-font-white'>" + dados + "</em></p>";
          $(listNode).append(description);
          $(listNode).append(result);
          $(listNode).append(dados);
          $(".lista-resultados > p").remove();
          return $(".lista-resultados ul").prepend($(listNode));
      }
    };
  })(this);
  this.rolarDados = (function(_this) {
    return function(sistema) {
      var count, dice, failure, i, len, resultado, rolagem, rolagens;
      count = new Number(1.);
      failure = new Number(0);
      rolagens = new Array();
      resultado = new Array();
      while (count <= _this.infoTeste.rolagemPadrao) {
        dice = Math.round(Math.random() * (10 - 1) + 1);
        if (dice === 10) {
          rolagens.push(dice);
        } else if (dice === 1) {
          rolagens.push(dice);
          failure++;
          count++;
        } else {
          rolagens.push(dice);
          count++;
        }
      }
      for (i = 0, len = rolagens.length; i < len; i++) {
        rolagem = rolagens[i];
        if (rolagem >= _this.infoTeste.dificuldade) {
          resultado.push(rolagem);
        }
      }
      if (sistema === "mascara") {
        resultado = resultado.length + _this.infoTeste.sucessosAuto - failure;
      } else {
        resultado = resultado.length + _this.infoTeste.sucessosAuto;
      }
      if (resultado === 0) {
        resultado = "Falha.";
        return _this.msgResultado("default", resultado, rolagens);
      } else if (resultado < 0) {
        resultado = "Falha Crítica.";
        return _this.msgResultado("default", resultado, rolagens);
      } else {
        resultado = resultado + " Sucessos.";
        return _this.msgResultado("default", resultado, rolagens);
      }
    };
  })(this);
  this.iniciativa = (function(_this) {
    return function() {
      var iniciativa, resultado;
      iniciativa = Math.round(Math.random() * 10);
      resultado = _this.infoTeste.atributo + _this.infoTeste.habilidade + _this.infoTeste.vantagens + iniciativa - _this.infoTeste.penalidade;
      return _this.msgResultado("init", resultado, iniciativa);
    };
  })(this);
  this.sorte = (function(_this) {
    return function() {
      var dado, resultado;
      dado = Math.round(Math.random() * (10 - 1) + 1);
      if (dado === 10) {
        resultado = "Sucesso";
        return _this.msgResultado("sorte", resultado, dado);
      } else if (dado === 1) {
        resultado = "Falha crítica";
        return _this.msgResultado("sorte", resultado, dado);
      } else {
        resultado = "Falha";
        return _this.msgResultado("sorte", resultado, dado);
      }
    };
  })(this);
  this.init = (function(_this) {
    return function() {
      $(".cp-radio").on("click", function(event) {
        var targetID;
        targetID = "#" + $(this).attr("id");
        $(targetID).children("input[type=radio]").prop("checked", true);
        $(".cp-radio").children(".button").html("&nbsp;");
        return $(targetID).children(".button").html("X");
      });
      return $("#rolar,#iniciativa,#sorte").on("click", function(event) {
        var sistemaID, targetID;
        event.preventDefault();
        targetID = event.target.id;
        sistemaID = $(".cp-radio input[type=radio]:checked").parent(".cp-radio").attr("id");
        _this.ctrlError(true);
        _this.infoTeste = {
          nome: $("#nome").val(),
          acao: $("#acao").val(),
          atributo: Number($("#atributo").val()),
          habilidade: Number($("#habilidade").val()),
          vantagens: Number($("#vantagens").val()),
          penalidade: Number($("#penalidades").val()),
          sucessosAuto: Number($("#sucesso").val()),
          dificuldade: Number($("#dificuldade").val()),
          rolagemPadrao: new Number()
        };
        if (_this.infoTeste.nome === "" && _this.infoTeste.acao === "") {
          _this.infoTeste.nome = "Personagem/NPC";
          _this.infoTeste.acao = "realizar alguma ação";
        } else if (_this.infoTeste.nome === "") {
          _this.infoTeste.nome = "Personagem/NPC";
        } else {
          _this.infoTeste.acao = "realizar alguma ação";
        }
        _this.infoTeste.rolagemPadrao = _this.infoTeste.atributo + _this.infoTeste.habilidade + _this.infoTeste.vantagens - _this.infoTeste.sucessosAuto - _this.infoTeste.penalidade;
        if (targetID === "rolar") {
          if ((_this.infoTeste.atributo <= 0 && _this.infoTeste.habilidade <= 0) && _this.infoTeste.vantagens > 0) {
            return _this.msgErro("vantage");
          } else if (_this.infoTeste.rolagemPadrao <= 0) {
            return _this.msgErro("default");
          } else {
            return _this.rolarDados(sistemaID);
          }
        } else if (targetID === "iniciativa") {
          return _this.iniciativa();
        } else {
          return _this.sorte();
        }
      });
    };
  })(this);
  return $((function(_this) {
    return function() {
      return _this.init();
    };
  })(this));
})();

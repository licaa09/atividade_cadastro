
const formulario = document.getElementById("form");
const mensagem = document.getElementById("msg");
const btn = document.getElementById("btn");

const formularioExcluir = document.getElementById("form-excluir");
const mensagemExcluir = document.getElementById("msg-excluir");
const btnExcluir = document.getElementById("btn-excluir");


formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const curso = document.getElementById("curso").value;

    btn.disabled = true;
    mensagem.textContent = "Enviando cadastro...";

    try {
        const resposta = await fetch("/api/alunos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                curso: curso
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagem.textContent =
                `${dados.msg} ID do aluno: ${dados.id}.`;

      
            formulario.reset();

            document.getElementById("aluno-id").value = dados.id;
        } else {
            mensagem.textContent =
                dados.msg || "Não foi possível cadastrar o aluno.";
        }
    } catch (erro) {
        mensagem.textContent =
            "Falha na comunicação. Verifique o servidor e tente novamente.";
    } finally {
        btn.disabled = false;
    }
});


formularioExcluir.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const campoId = document.getElementById("aluno-id");
    const id = campoId.valueAsNumber;

    if (!Number.isInteger(id) || id <= 0) {
        mensagemExcluir.textContent =
            "Informe um ID que seja um número inteiro positivo.";
        return;
    }

    if (!confirm(`Deseja realmente excluir o aluno de ID ${id}?`)) {
        mensagemExcluir.textContent = "Exclusão cancelada.";
        return;
    }

    btnExcluir.disabled = true;
    mensagemExcluir.textContent = "Excluindo aluno...";

    try {
        const resposta = await fetch(`/api/alunos/${id}`, {
            method: "DELETE"
        });

        const dados = await resposta.json();

        mensagemExcluir.textContent = dados.msg;

        if (resposta.ok) {

            campoId.value = "";
        }
    } catch (erro) {
        mensagemExcluir.textContent =
            "Falha na comunicação. Verifique o servidor e tente novamente.";
    } finally {
        btnExcluir.disabled = false;
    }
});


from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Lista temporária de alunos
alunos = []

proximo_id = 1


@app.get("/")
def inicio():
    return render_template("index.html")


@app.post("/api/alunos")
def cadastrar_aluno():
    global proximo_id

    dados = request.get_json(silent=True)

    if not isinstance(dados, dict):
        return jsonify(msg="Envie um objeto JSON válido."), 400

    nome = dados.get("nome")
    email = dados.get("email")
    curso = dados.get("curso")

    # Validar os três campos
    campos = {
        "nome": nome,
        "e-mail": email,
        "curso": curso
    }

    for campo, valor in campos.items():
        if not isinstance(valor, str) or not valor.strip():
            return jsonify(
                msg=f"O campo {campo} é obrigatório."
            ), 400

    # Criar o cadastro com um ID único
    aluno = {
        "id": proximo_id,
        "nome": nome.strip(),
        "email": email.strip(),
        "curso": curso.strip()
    }

    alunos.append(aluno)
    proximo_id += 1

    return jsonify(
        msg=f'Aluno {aluno["nome"]} cadastrado com sucesso!',
        id=aluno["id"],
        aluno=aluno
    ), 201


@app.delete("/api/alunos/<int:aluno_id>")
def excluir_aluno(aluno_id):
    for aluno in alunos:
        if aluno["id"] == aluno_id:
            alunos.remove(aluno)

            return jsonify(
                msg=f'Aluno {aluno["nome"]} excluído com sucesso!',
                id=aluno_id
            ), 200

    return jsonify(
        msg=f"Nenhum aluno encontrado com o ID {aluno_id}."
    ), 404


if __name__ == "__main__":
    app.run(debug=True)

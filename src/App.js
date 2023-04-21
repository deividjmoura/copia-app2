import React from 'react';

function App() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const files = event.target.file.files;
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      console.log(await response.text());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Upload de arquivos</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="file" name="file" multiple />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default App;

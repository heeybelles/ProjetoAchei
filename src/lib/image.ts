/** Reduz a imagem enviada para caber no localStorage (máx. 800 px, JPEG). */
export function comprimirImagem(arquivo: File, maxLado = 800, qualidade = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!arquivo.type.startsWith('image/')) return reject(new Error('Selecione um arquivo de imagem (JPG, PNG ou WebP).'));
    if (arquivo.size > 8 * 1024 * 1024) return reject(new Error('A imagem deve ter no máximo 8 MB.'));
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Não foi possível abrir a imagem.'));
      img.onload = () => {
        const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Seu navegador não suporta o processamento de imagens.'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', qualidade));
      };
      img.src = String(leitor.result);
    };
    leitor.readAsDataURL(arquivo);
  });
}

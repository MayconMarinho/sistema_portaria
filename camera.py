import cv2
from pyzbar.pyzbar import decode
import time

# Inicia a captura de vídeo da webcam padrão do PC (índice 0)
video_capture = cv2.VideoCapture(0)

# Controle de tempo para não ler o mesmo QR Code dezenas de vezes por segundo
ultimo_scan_tempo = 0
cooldown = 3 

print("Câmera ligada! Pressione a tecla 'q' no seu teclado para sair da janela.")

while True:
    # Captura um único frame (quadro) do vídeo
    ret, frame = video_capture.read()

    # A biblioteca procura por QR Codes no frame capturado (substituindo a busca por rostos)
    qr_codes = decode(frame)

    # Desenha um retângulo verde ao redor de cada QR Code encontrado
    for qr in qr_codes:
        (x, y, w, h) = qr.rect
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 3)
        
        # Extrai o texto/token de dentro do QR Code
        token_qr = qr.data.decode('utf-8')
        
        tempo_atual = time.time()
        # Valida se já passou o tempo de espera desde a última leitura
        if tempo_atual - ultimo_scan_tempo > cooldown:
            print(f"QR Code Detectado: {token_qr}")
            # Aqui você fará a chamada para o Supabase/Backend para liberar a catraca
            
            ultimo_scan_tempo = tempo_atual

    # Mostra o resultado do vídeo em uma nova janela
    cv2.imshow('Controle de Acesso - Acos F Sacchelli', frame)

    # Aguarda a tecla 'q' ser pressionada para encerrar o programa
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Quando terminar, libera a câmera e fecha a janela
video_capture.release()
cv2.destroyAllWindows()
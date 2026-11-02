import traceback

try:
    print("Tentando importar face_recognition_models...")
    import face_recognition_models
    print("Sucesso! Os modelos foram importados corretamente.")
except Exception as e:
    print("Ocorreu um erro real ao tentar importar:")
    traceback.print_exc()
    
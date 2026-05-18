-- =====================================================
-- VENTA DE GARAGE - SUPABASE SETUP
-- Correr este script en el SQL Editor de Supabase
-- =====================================================

-- 1. Crear tabla profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nombre TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear tabla products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  precio INTEGER NOT NULL CHECK (precio >= 0),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  imagenes TEXT[] DEFAULT '{}',
  vendido BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índice para búsqueda por fecha y ubicación
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_products_vendido ON products(vendido) WHERE vendido = false;

-- 4. Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 5. Políticas para profiles
-- Cada usuario puede ver todos los profiles (necesario para mostrar info del vendedor)
CREATE POLICY "Profiles son visibles para todos"
  ON profiles FOR SELECT
  USING (true);

-- Cada usuario puede actualizar solo su propio perfil
CREATE POLICY "Usuarios actualizan su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 6. Políticas para products
-- Cualquiera puede ver productos no vendidos y de menos de 7 días
CREATE POLICY "Productos visibles para todos"
  ON products FOR SELECT
  USING (vendido = false AND created_at > NOW() - INTERVAL '7 days');

-- Solo el dueño puede insertar productos
CREATE POLICY "Usuarios crean sus productos"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede actualizar sus productos (para marcar como vendido)
CREATE POLICY "Usuarios actualizan sus productos"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

-- Solo el dueño puede eliminar sus productos
CREATE POLICY "Usuarios eliminan sus productos"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, whatsapp)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Crear bucket de storage para imágenes
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 9. Políticas de storage
-- Cualquiera puede ver imágenes
CREATE POLICY "Imágenes son públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Usuarios autenticados pueden subir imágenes
CREATE POLICY "Usuarios autenticados suben imágenes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
  );

-- Usuarios pueden eliminar solo sus propias imágenes
CREATE POLICY "Usuarios eliminan sus imágenes"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

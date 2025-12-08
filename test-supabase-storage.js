// Script de prueba para verificar Supabase Storage
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zwxjzrkivkxiunaynwjp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3eGp6cmtpdmt4aXVuYXlud2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MjA5ODYsImV4cCI6MjA3NjM5Njk4Nn0.z1js8f1drU5i8eJkkn3oHImBehmjLc1Sr__j-vwfETg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testStorage() {
  console.log('🔍 Verificando conexión con Supabase...\n');
  
  try {
    // 1. Listar todos los buckets
    console.log('📦 Listando buckets disponibles...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error al listar buckets:', bucketsError);
      return;
    }
    
    console.log('✅ Buckets encontrados:', buckets.length);
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'PÚBLICO' : 'PRIVADO'})`);
    });
    
    // 2. Verificar si existe el bucket 'imagenes'
    const imagenesBucket = buckets.find(b => b.name === 'imagenes');
    
    if (!imagenesBucket) {
      console.log('\n❌ EL BUCKET "imagenes" NO EXISTE');
      console.log('\n📋 Solución:');
      console.log('   1. Ve a https://supabase.com');
      console.log('   2. Accede a tu proyecto');
      console.log('   3. Haz clic en "Storage"');
      console.log('   4. Haz clic en "Create a new bucket"');
      console.log('   5. Nombre: imagenes');
      console.log('   6. ✅ Marca "Public bucket"');
      console.log('   7. Clic en "Create bucket"');
      return;
    }
    
    console.log(`\n✅ El bucket "imagenes" EXISTE y es ${imagenesBucket.public ? 'PÚBLICO ✓' : 'PRIVADO ✗'}`);
    
    if (!imagenesBucket.public) {
      console.log('⚠️  ADVERTENCIA: El bucket debe ser PÚBLICO para que funcione');
      console.log('   Edita el bucket y marca "Public bucket"');
    }
    
    // 3. Intentar listar archivos en el bucket
    console.log('\n📁 Intentando acceder al contenido del bucket...');
    const { data: files, error: filesError } = await supabase.storage
      .from('imagenes')
      .list('productos', { limit: 1 });
    
    if (filesError) {
      console.error('❌ Error al acceder al bucket:', filesError.message);
      console.log('\n📋 Esto puede indicar que faltan las políticas RLS.');
      console.log('   Revisa el archivo CONFIGURACION_SUPABASE_STORAGE.md');
      return;
    }
    
    console.log('✅ Acceso al bucket correcto');
    
    console.log('\n🎉 TODO ESTÁ CONFIGURADO CORRECTAMENTE');
    console.log('   El sistema debería funcionar ahora.');
    
  } catch (error) {
    console.error('\n❌ Error inesperado:', error.message);
  }
}

testStorage();

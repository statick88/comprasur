-- Seed file for local development
-- Applied automatically by: supabase db reset

insert into public.products (name, price, description, color_primary, color_background, color_text, color_accent)
values
  ('Guantes de Nitrilo',    15.00, 'Guantes desechables de alta resistencia para procedimientos clínicos.',       '#2B6CB0','#EBF8FF','#1A365D','#BEE3F8'),
  ('Mascarilla N95',        25.00, 'Mascarilla de protección respiratoria con filtro de partículas.',             '#276749','#F0FFF4','#1C4532','#C6F6D5'),
  ('Jeringa 10ml',           5.00, 'Jeringa desechable de precisión con émbolo suave.',                          '#C05621','#FFFAF0','#7B341E','#FEEBC8'),
  ('Bisturí Quirúrgico',    12.00, 'Instrumento de corte estéril con mango ergonómico.',                         '#702459','#FFF5F7','#521B41','#FED7E2'),
  ('Vendaje Elástico',       8.00, 'Vendaje adaptable para inmovilización y compresión muscular.',               '#D69E2E','#FFFFF0','#744210','#FEFCBF'),
  ('Catéter Intravenoso',   18.00, 'Catéter flexible para administración de fluidos y medicamentos.',            '#553C9A','#FAF5FF','#322659','#E9D8FD');

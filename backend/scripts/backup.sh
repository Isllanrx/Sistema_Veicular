#!/bin/bash

# Configurações
BACKUP_DIR="/backups"
DB_NAME="control_car"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql"
RETENTION_DAYS=30

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Realizar backup
pg_dump -U $POSTGRES_USER -d $DB_NAME > $BACKUP_FILE

# Comprimir backup
gzip $BACKUP_FILE

# Remover backups antigos
find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Verificar se o backup foi bem sucedido
if [ $? -eq 0 ]; then
    echo "Backup realizado com sucesso: ${BACKUP_FILE}.gz"
else
    echo "Erro ao realizar backup"
    exit 1
fi 
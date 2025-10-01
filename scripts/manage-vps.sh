#!/bin/bash

VPS_IP="YOUR_VPS_IP"
VPS_USER="root"

case "$1" in
    "deploy")
        echo "🚀 Deploying to VPS..."
        ./scripts/deploy-production.sh
        ;;
    "backup")
        echo "💾 Creating backup on VPS..."
        ssh $VPS_USER@$VPS_IP "cd /var/www/voter-app && ./scripts/production-backup.sh"
        ;;
    "restore")
        echo "🔄 Restoring on VPS..."
        ssh $VPS_USER@$VPS_IP "cd /var/www/voter-app && ./scripts/production-restore.sh"
        ;;
    "status")
        echo "📊 Checking VPS status..."
        ssh $VPS_USER@$VPS_IP "pm2 status && systemctl status postgresql"
        ;;
    "logs")
        echo "📝 Viewing logs..."
        ssh $VPS_USER@$VPS_IP "pm2 logs voter-app --lines 50"
        ;;
    "restart")
        echo "🔄 Restarting application..."
        ssh $VPS_USER@$VPS_IP "pm2 restart voter-app"
        ;;
    "update")
        echo "🔄 Updating application..."
        # Upload new version
        tar -czf voter-app-update.tar.gz --exclude=node_modules --exclude=.next .
        scp voter-app-update.tar.gz $VPS_USER@$VPS_IP:/tmp/
        ssh $VPS_USER@$VPS_IP "cd /var/www/voter-app && tar -xzf /tmp/voter-app-update.tar.gz && npm install && pm2 restart voter-app"
        rm voter-app-update.tar.gz
        ;;
    *)
        echo "Usage: $0 {deploy|backup|restore|status|logs|restart|update}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Deploy application to VPS"
        echo "  backup  - Create backup on VPS"
        echo "  restore - Restore from backup on VPS"
        echo "  status  - Check VPS status"
        echo "  logs    - View application logs"
        echo "  restart - Restart application"
        echo "  update  - Update application code"
        ;;
esac
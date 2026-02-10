'use strict';

module.exports = {
    async changePassword(ctx) {
        try {
            console.log('=== CHANGE PASSWORD CONTROLLER ===');
            console.log('User ID from token:', ctx.state.user?.id);

            // Verifica se o usuário está autenticado
            if (!ctx.state.user) {
                console.log('Erro: Usuário não autenticado');
                return ctx.unauthorized('Usuário não autenticado');
            }

            const { password: newPassword } = ctx.request.body;

            // Validação básica
            if (!newPassword || newPassword.length < 6) {
                console.log('Erro: Senha inválida');
                return ctx.badRequest('Senha deve ter pelo menos 6 caracteres');
            }

            const userId = ctx.state.user.id;
            console.log('Atualizando senha para usuário ID:', userId);

            // Atualiza a senha do usuário
            const updatedUser = await strapi.plugins['users-permissions'].services.user.edit(
                { id: userId },
                { password: newPassword }
            );

            console.log('Senha atualizada com sucesso para usuário:', updatedUser.username);

            ctx.status = 200;
            ctx.body = {
                success: true,
                message: 'Senha alterada com sucesso',
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email
                }
            };
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: 'Erro interno do servidor',
                error: error.message
            };
        }
    }
};
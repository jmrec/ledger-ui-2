FROM mcr.microsoft.com/devcontainers/javascript-node:22

ARG USERNAME=node
ENV APP_HOME=/workspace

RUN apt-get update && apt-get install -y \
    procps \
    git \
    sudo \
    tree \
    screen \
    && rm -rf /var/lib/apt/lists/*

RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && mkdir -p $APP_HOME /home/$USERNAME/.vscode-server/extensions \
    && chown -R $USERNAME:$USERNAME $APP_HOME /home/$USERNAME

ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm add -g @quasar/cli

WORKDIR $APP_HOME
USER $USERNAME

EXPOSE 5173
export type Dispositivo = {
    id: number;
    nome?: string;
    local?: string;
    ip?: string;
    UDPport?: string;
    TCPport?: string;
    protocolo?: string;
    tipo?: string;
    ativo?: boolean,
    proxy?: boolean,
    porta_proxy?: string,
    status?: boolean
}
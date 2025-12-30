import { getRegisteredClients } from '@workspace/adapter-common/client';
import { NextBaseClient } from '../next-base.client';

import '@workspace/adapter-common/client/api';

const registeredClients = getRegisteredClients();

for (const ClientClass of registeredClients) {
    const proto = ClientClass.prototype as any;
    const nextProto = NextBaseClient.prototype as any;
    
    proto.request = nextProto.request;
    proto.get = nextProto.get;
    proto.post = nextProto.post;
    proto.put = nextProto.put;
    proto.delete = nextProto.delete;
}

export * from '@workspace/adapter-common/client/api';

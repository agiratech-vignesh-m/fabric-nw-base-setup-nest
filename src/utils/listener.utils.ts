import { ChaincodeEvent, CloseableAsyncIterable, Contract, Network } from "@hyperledger/fabric-gateway";

const utf8Decoder = new TextDecoder();

export async function startEventListening(chaincode_name: string, network: Network): Promise<CloseableAsyncIterable<ChaincodeEvent>> {
  console.log('\n*** Start chaincode event listening');

  const events = await network.getChaincodeEvents(chaincode_name);

  // const result = await readEvents(events); // Don't await - run asynchronously
  void readEvents(events); // Don't await - run asynchronously

  return events;
}

async function readEvents(events: CloseableAsyncIterable<ChaincodeEvent>): Promise<unknown[]> {
  const payloads: unknown[] = [];
  try {
      for await (const event of events) {
          const payload = parseJson(event.payload);
          console.log(`\n<-- Chaincode event received: ${event.eventName} -`, payload);
          payloads.push(payload);
      }

      return payloads;
  } catch (error: unknown) {
      console.log("error", error)
  }
}

function parseJson(jsonBytes: Uint8Array): unknown {
  const json = utf8Decoder.decode(jsonBytes);
  return JSON.parse(json);
}

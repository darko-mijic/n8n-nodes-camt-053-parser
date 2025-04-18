import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

// Import your camt-parser npm library
import { parseCamt053 } from 'camt-parser';

// Use official types from camt-parser
import type { Camt053Statement } from 'camt-parser/dist/types';

// Output type for the node's json property
export type Camt053Output =
  | { statement: Camt053Statement }
  | { error: string; itemIndex: number };

export class Camt053Parser implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Camt053 Parser',
		name: 'camt053Parser',
		icon: 'fa:file-code',
		group: ['transform'],
		version: 1,
		description: 'Parse camt.053 XML messages to JSON',
		subtitle: 'Parse camt.053 XML',
		defaults: {
			name: 'Camt053 Parser',
			color: '#00b8b6',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'XML String',
				name: 'xml',
				type: 'string',
				default: '',
				description: 'The camt.053 XML string to parse',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Process all items concurrently for performance
		await Promise.all(items.map(async (item, i) => {
			try {
				// Get required 'xml' parameter (n8n will throw if missing)
				const xml = this.getNodeParameter('xml', i) as string;
				if (!xml || typeof xml !== 'string') {
					throw new NodeOperationError(this.getNode(), `Input XML is empty or invalid for item ${i}.`);
				}

				// Parse the XML string
				const parsed = await parseCamt053(xml) as Camt053Statement | Camt053Statement[];

				// Standardize output as an array of statements
				const statements = Array.isArray(parsed) ? parsed : [parsed];
				for (const statement of statements) {
					returnData.push({ json: { statement } as Camt053Output });
				}
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				if (this.continueOnFail()) {
					returnData.push({ json: { error: errorMessage, itemIndex: i } as Camt053Output });
				} else {
					throw new NodeOperationError(this.getNode(), errorMessage, { itemIndex: i });
				}
			}
		}));

		return [returnData];
	}
}

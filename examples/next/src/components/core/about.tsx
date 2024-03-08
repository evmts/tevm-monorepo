import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Icons } from '@/components/common/icons';
import { InlineCode, LinkTo, List, P } from '@/components/common/typography';

/**
 * @notice Informations and notes about the app
 */
const About = () => {
  const triggerClasses =
    'text-md text-secondary-foreground hover:no-underline hover:text-primary transition-colors duration-100 scroll-m-20 font-semibold tracking-tight';

  return (
    <div className="my-2 flex flex-col gap-1">
      <Accordion
        type="single"
        collapsible
        defaultValue="what"
        className="w-full"
      >
        {/* -------------------------------------------------------------------------- */}
        {/*                              WHAT IS THIS APP                              */}
        {/* -------------------------------------------------------------------------- */}
        <AccordionItem value="what">
          <AccordionTrigger className={triggerClasses}>
            What is this app?
          </AccordionTrigger>
          <AccordionContent>
            <P>
              <span className="font-semibold">Think ~ Etherscan + Remix</span>.
            </P>
            <P>
              Basically, it&apos;s a way to interact with contracts and EOAs{' '}
              <span className="font-semibold">
                in a simulated environment, from a forked chain
              </span>
              , with{' '}
              <LinkTo href="https://tevm.sh/learn/actions/">
                a comprehensive set of actions
              </LinkTo>{' '}
              exposed by{' '}
              <LinkTo href="https://tevm.sh/learn/clients/">
                Tevm memory clients
              </LinkTo>
              .
            </P>
            <P>
              As you interact with accounts, all{' '}
              <LinkTo href="https://tevm.sh/reference/tevm/actions-types/type-aliases/callhandler">
                transactions are processed
              </LinkTo>{' '}
              and recorded by the client, which always considers the latest
              state of the chain; i.e. the initial state at the time of the
              fork, plus all the local transactions.
            </P>
            <P>
              When you search for a contract, it will attempt to retrieve its
              ABI with{' '}
              <LinkTo href="https://github.com/shazow/whatsabi">
                WhatsABI
              </LinkTo>
              . You can then interact with it using the interface, or perform
              any arbitrary call with encoded data.
            </P>
            <P>
              The clients for each chain are synced with the local storage, as
              well as the transaction history. When the chain is reset, the
              client forks the chain again at the latest block, which
              incidentally resets the local transactions history.
            </P>
          </AccordionContent>
        </AccordionItem>
        {/* -------------------------------------------------------------------------- */}
        {/*                              HOW TO USE                                    */}
        {/* -------------------------------------------------------------------------- */}
        <AccordionItem value="how">
          <AccordionTrigger className={triggerClasses}>
            How to use?
          </AccordionTrigger>
          {/* --------------------------------- SEARCH --------------------------------- */}
          <AccordionContent>
            <span className="font-semibold">Search</span>
            <List
              items={[
                <>
                  Select a chain and paste the address of a contract, or click{' '}
                  <InlineCode>Try with an example</InlineCode>.
                </>,
                <>
                  Click <InlineCode>Fork chain</InlineCode> to fork the chain
                  again at the latest block.
                </>,
              ]}
            />
            {/* --------------------------------- CALLER --------------------------------- */}
            <span className="font-semibold">Caller</span>
            <List
              items={[
                <>
                  Enter an address to impersonate during calls; you can click{' '}
                  <InlineCode>owner</InlineCode> to impersonate the owner of the
                  contract if it found an appropriate method.
                </>,
                <>
                  Toggle <InlineCode>skip balance</InlineCode> to{' '}
                  <LinkTo href="https://tevm.sh/reference/tevm/actions-types/type-aliases/basecallparams/#skipbalance">
                    <em>ignore</em> or not the native tokens balance
                  </LinkTo>{' '}
                  during calls.
                </>,
              ]}
            />
            {/* ----------------------------- LOW LEVEL CALL ----------------------------- */}
            <span className="font-semibold">Low-level call</span>
            <List
              items={[
                <>
                  Call the current account with an arbitrary amount of native
                  tokens and/or arbitrary encoded data.
                </>,
              ]}
            />
            {/* ---------------------------- CONTRACT INTERFACE ---------------------------- */}
            <span className="font-semibold">Contract interface</span>
            <List
              items={[
                <>
                  The ABI is displayed inside a table you can navigate through;
                  fill the inputs if relevant, and click{' '}
                  <InlineCode>Call</InlineCode> to send a transaction.
                </>,
                <>
                  Read methods are highlighted when they were found with
                  certitude.
                </>,
              ]}
            />
            {/* --------------------------- LOCAL TRANSACTIONS --------------------------- */}
            <span className="font-semibold">Local transactions</span>
            <List
              items={[
                <>
                  The history of transactions displayed is the one recorded by
                  the client for the selected chain, since the last fork.
                </>,
                <>
                  You can navigate through the history, click{' '}
                  <InlineCode>
                    <Icons.down className="inline-block size-3" />
                  </InlineCode>{' '}
                  to see more details (data, errors, logs, inputs...), and click
                  on an address to search for it.
                </>,
              ]}
            />
          </AccordionContent>
        </AccordionItem>
        {/* -------------------------------------------------------------------------- */}
        {/*                              NOTES                                         */}
        {/* -------------------------------------------------------------------------- */}
        <AccordionItem value="notes">
          <AccordionTrigger className={triggerClasses}>Notes</AccordionTrigger>
          <AccordionContent>
            There are a few issues/pitfalls to be aware of:
            <List
              items={[
                <>
                  Obviously, there might (will probably) be some unhandled
                  errors, rejections, or bugs. Please report them so we can fix
                  them and improve either Tevm or this example!
                </>,
                <>
                  WhatsABI might struggle with proxies, currently the app
                  doesn&apos;t support redirecting to the implementation
                  contract.
                </>,
                <>
                  Currently, to use Tevm on the browser we need to expose the
                  API keys to the browser (for RPC queries). This is definitely
                  not ideal, but the only way to be able to use Tevm clients
                  synced with local storage.
                </>,
              ]}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default About;

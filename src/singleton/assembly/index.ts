import { storage, Context } from "near-sdk-core"

@nearBindgen
export class Contract {

  private quotes: Array<string> = [
    "“There is no end to education. It is not that you read a book, pass an examination, and finish with education. The whole of life, from the moment you are born to the moment you die, is a process of learning.” – Jiddu Krishnamurti",
    "“We now accept the fact that learning is a lifelong process of keeping abreast of change. And the most pressing task is to teach people how to learn.” – Peter Drucker",
    "“I am always ready to learn although I do not always like being taught.” – Winston Churchill",
    "“Live as if you were to die tomorrow. Learn as if you were to live forever.” – Mahatma Gandhi",
    "“Wisdom is not a product of schooling but of the lifelong attempt to acquire it.” – Albert Einstein",
    "“One learns from books and example only that certain things can be done. Actual learning requires that you do those things.” – Frank Herbert",
    "“Tell me and I forget, teach me and I may remember, involve me and I learn.” – Benjamin Franklin",
    "“Develop a passion for learning. If you do, you will never cease to grow.” – Anthony J. D’Angelo",
    "“One hour per day of study in your chosen field is all it takes. One hour per day of study will put you at the top of your field within three years. Within five years you’ll be a national authority. In seven years, you can be one of the best people in the world at what you do.” – Earl Nightingale",
  "“You don’t understand anything until you learn it more than one way.” – Marvin Minsky"]

  @mutateState()
  generateLuckyQuote(): string {
    const predecessor = Context.predecessor
    const contractName = Context.contractName
    
    const quote: string = this.generateQuoteFromSender(predecessor)
    const filler = new Array<string>(quote.length).fill('*').toString().replaceAll(',', '')

    let count = this.getCountFromStorage()
    count = this.incrementCountInStorage(count)

    return `You are person #${count} who used this NEAR Smart Contract!
Quote generator from ${contractName} takes your NEAR wallet id ${predecessor} and gives you a random quote based on your NEAR wallet id.
Please find below quote about learning that has been assigned to your id:
${filler}
${quote}
${filler}`
  }

  private generateQuoteFromSender(predecessor: string):string {
    const charCodes: Array<i32> = []
    for (var i = 0; i < predecessor.length; i++) {
      charCodes.push(predecessor.charCodeAt(i))
    }
    let sum = 0 
    for (var j = 0; j < charCodes.length; j++) {
      sum += charCodes[j]
    }
    const luckyNumber = sum % 10
    return this.quotes[luckyNumber]
  }

  private getCountFromStorage(): string {
    if (isKeyInStorage('quotesCount' )) {
      return storage.getString('quotesCount' )!
    } else {
      return "0"
    }
  }
  
  private incrementCountInStorage(count: string): string {
    let numCount: number = parseInt(count)
    numCount += 1
    const newCount = numCount.toString().split('.')[0]
    storage.set('quotesCount', newCount)
    return newCount
  }
}

/**
 * This function exists only to avoid a compiler error
 *
ERROR TS2339: Property 'contains' does not exist on type 'src/singleton/assembly/index/Contract'.
     return this.contains(key);
                 ~~~~~~~~
 in ~lib/near-sdk-core/storage.ts(119,17)
/Users/sherif/Documents/code/near/_projects/edu.t3/starter--near-sdk-as/node_modules/asbuild/dist/main.js:6
        throw err;
        ^
 * @param key string key in account storage
 * @returns boolean indicating whether key exists
 */
function isKeyInStorage(key: string): bool {
  return storage.hasKey(key)
}



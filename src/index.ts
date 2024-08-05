import 'dotenv/config'

import { OpenAI } from 'openai'
import { createInterface } from 'node:readline/promises'

import { holmesAsciiImage } from './assets'

const inputPrompt = createInterface({
    input: process.stdin,
    output: process.stdout
})

const abortOperation = new AbortController()

function closeApp(){
    abortOperation.abort()
    inputPrompt.close()
}

function greetings() {
    console.log(holmesAsciiImage)
    console.log(`\r
       \r'------------------------------------------'
       \r               --HOLMES AI--
       \r
       \r    Easy and quick prompt from your shell
       \r'------------------------------------------'        
       \r `)
}

(async () => {
    greetings()

    const openAiClient = new OpenAI()
    console.log('Ctrl + C -> To Exit..')

    do {
        const userInput = await inputPrompt.question('Question..?\n\r> ', { signal: abortOperation.signal })
        const response = await openAiClient.chat.completions.create({
            messages: [
                { role: 'system', content: userInput }
            ],
            model: 'gpt-4o-mini',
            stream: true,
        })

        for await (const line of response) {
            process.stdout.write(line.choices[0]?.delta?.content || '')
        }

        console.log('\n')
    } while (true)
})()

process.on('SIGINT', () => {
    closeApp()
    console.log('sigint')
    process.exit(0)
})

process.on('unhandledRejection', () => {
    closeApp()
    console.log('unhandledRejection')
    process.exit(0)
})

process.on('unhandledException', () => {
    closeApp()
    console.log('unhandledException')
    process.exit(0)
})

process.on('exit', () => {
    closeApp()
    console.log('exit')
})

// process.on('SIGKILL', () => {
//     console.log('close signal has been received')
// })
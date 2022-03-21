#!/usr/bin/env node
/// <reference types="node" />

const { spawn } = require('child_process')
const { build } = require('esbuild')
const { mkdtempSync, existsSync } = require('fs')
const { tmpdir } = require('os')
const { basename, join } = require('path')

var programName = basename(process.argv[1])

const usage = `usage: ${programName} <FILENAME>`

const input = process.argv[2]
if (!existsSync(input)) {
    console.error(`file does not exist: ${input}\n${usage}`)
    process.exit(1)
}
const name = basename(input).slice(0, -3)

const outdir = mkdtempSync(tmpdir())
const outfile = join(outdir, name + '.js')
build({
    entryPoints: [input],
    bundle: true,
    target: 'node14',
    format: 'cjs',
    platform: 'node',
    sourcemap: true,
    outfile: outfile,
})
    .then(() => {
        spawn(`/usr/bin/env`, [`node`, `--enable-source-maps`, `${outfile}`], {
            stdio: 'inherit',
        })
    })
    .catch(err => console.error('build problem:', err))
